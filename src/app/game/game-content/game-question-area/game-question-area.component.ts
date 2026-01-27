import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {QuestionComponent} from './question/question.component';
import {QuestionAreaHeaderComponent} from './question-area-header/question-area-header.component';
import {MATERIAL_IMPORTS} from '../../../shared/material';
import {GameService} from '../../../shared/game.service';
import {CATEGORY_LIST} from '../../../shared/category/categoryList';
import {Category, Hint} from '../../../shared/category/category.interface';

@Component({
  selector: 'app-game-question-area',
  templateUrl: './game-question-area.component.html',
  standalone: true,
  imports: [MATERIAL_IMPORTS, CommonModule, QuestionAreaHeaderComponent, RouterOutlet],
  styleUrl: './game-question-area.component.css'
})
export class GameQuestionAreaComponent implements OnInit {
  currentCategory!: Category;
  usedHints: Hint[] = [];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService
  ) {
  }

  ngOnInit() {
    const categoryName = this.route.snapshot.paramMap.get('name')!;
    this.currentCategory = CATEGORY_LIST.find(c => c.name === categoryName)!;
  }

  wrong() {
    this.gameService.nextTeam();
    this.router.navigate(['/game']);
  }

  calculatePoints(): number {
    if (!this.currentCategory) return 0;
    const base = this.currentCategory.basePoints;
    const totalPenalty = this.usedHints.reduce((sum, h) => sum + h.penaltyPercent, 0);
    const multiplier = Math.max(0, 1 - totalPenalty / 100);
    return Math.round(base * multiplier);
  }

  correct() {
    const points = this.calculatePoints();
    this.gameService.addPointsToCurrentTeam(points);
    this.gameService.nextTeam();
    this.router.navigate(['/game']);
  }

  onHintUsed(hint: Hint) {
    if (!this.usedHints.includes(hint)) {
      this.usedHints.push(hint);
    }
  }


}
