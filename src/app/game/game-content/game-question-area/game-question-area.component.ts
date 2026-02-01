import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {QuestionAreaHeaderComponent} from './question-area-header/question-area-header.component';
import {MATERIAL_IMPORTS} from '../../../shared/material';
import {GameService} from '../../../shared/game.service';
import {CATEGORY_LIST} from '../../../shared/category/categoryList';
import {Category, Hint} from '../../../shared/category/category.interface';
import {QuestionService} from '../../../shared/question-service.service';
import {AnswerComponent} from './answer/answer.component';

@Component({
  selector: 'app-game-question-area',
  templateUrl: './game-question-area.component.html',
  standalone: true,
  imports: [MATERIAL_IMPORTS, CommonModule, QuestionAreaHeaderComponent, RouterOutlet, AnswerComponent],
  styleUrl: './game-question-area.component.css'
})
export class GameQuestionAreaComponent implements OnInit {
  currentCategory!: Category;
  basePoints = 0;
  usedHints: Hint[] = [];



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    private questionService: QuestionService
  ) {
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const type = params.get('type');
      const name = params.get('name');

      if (!type || !name) {
        throw new Error('Brak parametrów kategorii w URL');
      }

      const category = CATEGORY_LIST.find(
        c => c.type === type && c.name === name
      );

      if (!category) {
        throw new Error('Nie znaleziono kategorii');
      }

      this.currentCategory = category;
      //this.currentPoints = category.basePoints;

      // 🔥 TU LOSUJEMY PYTANIE
      this.questionService.loadRandomQuestion(type, name);
    });
  }

  wrong() {
// reset hintów również, jeśli chcesz, żeby kolejne pytanie było "czyste"
    this.usedHints = [];


    this.gameService.nextTeam();
    this.router.navigate(['/game']);
  }

  calculatePoints(): number {
    if (!this.currentCategory) return 0;

    const base = this.currentCategory.basePoints;

    const totalPenaltyPercent = this.usedHints
      .reduce((sum, hint) => sum + hint.penaltyPercent, 0);

    const multiplier = Math.max(0, 1 - totalPenaltyPercent / 100);

    return Math.round(base * multiplier);
  }

  correct() {
    const points = this.currentPoints; // <-- getter
    this.gameService.addPointsToCurrentTeam(points);
    this.usedHints = []; // reset hintów
    this.gameService.nextTeam();
    this.router.navigate(['/game']);
  }



  onHintUsed(hint: Hint): void {
// dodaj hint jeśli nie był wcześniej użyty
    if (!this.usedHints.some(h => h.id === hint.id)) {
      this.usedHints.push(hint);
    }
    console.log('usedHints:', this.usedHints);
  }

  onActivate(component: any): void {
    console.log('Activated component:', component);


    if (component.hintUsed) {
      component.hintUsed.subscribe((hint: Hint) => {
        console.log('HINT RECEIVED IN GAME', hint); // 🔥
        this.onHintUsed(hint);
      });
    }
  }

  get currentPoints(): number {
    if (!this.currentCategory) return 0;

    const totalPenalty = this.usedHints.reduce((sum, h) => sum + h.penaltyPercent, 0);
    const multiplier = Math.max(0, 1 - totalPenalty / 100);

    return Math.round(this.currentCategory.basePoints * multiplier);
  }

  half() {
    const points = Math.ceil(this.currentPoints / 2);
    this.gameService.addPointsToCurrentTeam(points);
    this.usedHints = [];
    this.gameService.nextTeam();
    this.router.navigate(['/game']);
  }

  revealAnswer(index: number) {
    this.questionService.revealAnswer(index);
  }

}
