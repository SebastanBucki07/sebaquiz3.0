import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {QuestionComponent} from './question/question.component';
import {QuestionAreaHeaderComponent} from './question-area-header/question-area-header.component';
import {MATERIAL_IMPORTS} from '../../../shared/material';
import {GameService} from '../../../shared/game.service';

@Component({
  selector: 'app-game-question-area',
  templateUrl: './game-question-area.component.html',
  standalone: true,
  imports: [MATERIAL_IMPORTS, CommonModule, QuestionComponent, QuestionAreaHeaderComponent],
  styleUrl: './game-question-area.component.css'
})
export class GameQuestionAreaComponent implements OnInit {
  categoryName!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService
  ) {
  }

  ngOnInit() {
    this.categoryName = this.route.snapshot.paramMap.get('name')!;
  }

  wrong() {
    this.gameService.nextTeam();
    this.router.navigate(['/game']);
  }

  correct() {
    this.gameService.addPointsToCurrentTeam(1);
    this.gameService.nextTeam();
    this.router.navigate(['/game']);
  }
}
