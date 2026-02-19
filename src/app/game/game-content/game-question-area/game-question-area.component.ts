import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {QuestionAreaHeaderComponent} from './question-area-header/question-area-header.component';
import {GameService} from '../../../shared/game.service';
import {CATEGORY_LIST} from '../../../shared/category/categoryList';
import {Category, Hint} from '../../../shared/category/category.interface';
import {QuestionService} from '../../../shared/question-service.service';
import {AnswerComponent} from './answer/answer.component';
import {PointsService} from '../../../shared/points-service.service';

@Component({
  selector: 'app-game-question-area',
  templateUrl: './game-question-area.component.html',
  standalone: true,
  imports: [CommonModule, QuestionAreaHeaderComponent, RouterOutlet, AnswerComponent],
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
    private questionService: QuestionService,
    private pointsService: PointsService
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

      this.pointsService.setPoints(this.currentCategory.basePoints);


      //this.currentPoints = category.basePoints;

      // 🔥 HERE WE DRAW A QUESTION
      this.questionService.loadRandomQuestion(type, name);
    });
  }

  wrong() {
// also reset hints if you want the next question to be "clean"
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
    this.pointsService.awardPointsToCurrentTeam(); // automatycznie bierze aktualne availablePoints
    this.usedHints = [];
    this.gameService.nextTeam();
    this.router.navigate(['/game']);
  }


  onHintUsed(hint: Hint): void {
    if (!this.usedHints.some(h => h.id === hint.id)) {
      this.usedHints.push(hint);
      this.pointsService.applyHintPenalty(); // zmniejszamy punkty automatycznie
    }
    console.log('usedHints:', this.usedHints, 'availablePoints:', this.pointsService.getAvailablePoints());
  }


  // get currentPoints(): number {
  //   if (!this.currentCategory) return 0;
  //
  //   const totalPenalty = this.usedHints.reduce((sum, h) => sum + h.penaltyPercent, 0);
  //   const multiplier = Math.max(0, 1 - totalPenalty / 100);
  //
  //   return Math.round(this.currentCategory.basePoints * multiplier);
  // }

  // get currentPoints(): number {
  //   let points = this.pointsService.getAvailablePoints();
  //
  //   const totalPenalty = this.usedHints.reduce((sum, h) => sum + h.penaltyPercent, 0);
  //   const multiplier = Math.max(0, 1 - totalPenalty / 100);
  //
  //   return Math.round(points * multiplier);
  // }

  get currentPoints(): number {
    if (!this.currentCategory) return 0;

    const base = this.currentCategory.basePoints;

    // pobranie dostępnych punktów z PointsService, fallback na base jeśli 0
    const available = this.pointsService.getAvailablePoints();
    const effectivePoints = available > 0 ? available : base;

    // uwzględnienie użytych hintów
    const totalPenaltyPercent = this.usedHints.reduce((sum, h) => sum + h.penaltyPercent, 0);
    const multiplier = Math.max(0, 1 - totalPenaltyPercent / 100);

    return Math.round(effectivePoints * multiplier);
  }




  half() {
    const points = Math.ceil(this.pointsService.getAvailablePoints() / 2);
    this.pointsService.awardPointsToCurrentTeam(points);
    this.usedHints = [];
    this.gameService.nextTeam();
    this.router.navigate(['/game']);
  }


  revealAnswer(index: number) {
    this.questionService.revealAnswer(index);
  }

  // GameQuestionAreaComponent
  public onActivate(component: any): void {
    console.log('Activated component:', component);

    if (component.hintUsed) {
      component.hintUsed.subscribe((hint: Hint) => {
        console.log('HINT RECEIVED IN GAME', hint);
        this.onHintUsed(hint);
      });
    }
  }


}
