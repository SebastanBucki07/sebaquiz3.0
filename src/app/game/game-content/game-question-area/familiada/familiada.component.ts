import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, tap } from 'rxjs';

// Services
import { QuestionService } from '../../../../services/question-service.service';
import { GameService } from '../../../../services/game.service';
import { PointsService } from '../../../../services/points-service.service';

// Models & Utils
import { Question } from '../../../../shared/questions/question.interface';
import { areSimilar, calculateGamePoints, normalizeText } from '../../../../shared/utils/text-logic';
import { playSound } from '../../../../shared/utils/audio-helper';

@Component({
  selector: 'app-familiada',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './familiada.component.html',
  styleUrls: ['./familiada.component.css'],
})
export class FamiliadaComponent implements OnInit {
  readonly MAX_CHANCES = 3;
  readonly MAX_POINTS_MULTIPLIER = 5;

  question$!: Observable<Question | null>;
  currentQuestion: Question | null = null;

  currentTeamName: string | null = null;
  mistakes = 0;
  gameFinished = false;
  inputValue = '';
  earnedPoints = 0;

  constructor(
    private questionService: QuestionService,
    private gameService: GameService,
    private pointsService: PointsService
  ) {}

  ngOnInit(): void {
    this.question$ = this.questionService.question$.pipe(
      tap(q => {
        if (q && this.currentQuestion && q.id !== this.currentQuestion.id) {
          this.resetRound();
        }

        this.currentQuestion = q;
      })
    );

    this.gameService.currentTeam$.subscribe(name => this.currentTeamName = name);
  }

  private resetRound(): void {
    this.mistakes = 0;
    this.gameFinished = false;
    this.earnedPoints = 0;
    this.inputValue = '';
  }

  submitAnswer(): void {
    if (this.gameFinished || this.mistakes >= this.MAX_CHANCES) return;

    const q = this.currentQuestion;
    if (!q || !this.inputValue.trim()) return;

    const normalizedInput = normalizeText(this.inputValue);

    const answerIndex = q.answers.findIndex((a, index) => {
      const isMatch = normalizeText(a.value) === normalizedInput || areSimilar(normalizedInput, a.value);
      const isAlreadyRevealed = q.revealedAnswers?.includes(index) ?? false;

      return isMatch && !isAlreadyRevealed;
    });

    if (answerIndex >= 0) {
      this.questionService.revealAnswer(answerIndex);
      playSound('correct');
      this.inputValue = '';

      if ((q.revealedAnswers?.length || 0) + 1 === q.answers.length) {
        this.finishGame();
      }
    } else {
      this.handleMistake();
    }
  }

  private handleMistake(): void {
    this.mistakes++;
    playSound('wrong');
    this.inputValue = '';

    if (this.mistakes >= this.MAX_CHANCES) {
      this.finishGame();
    }
  }

  finishGame(): void {
    if (this.gameFinished) return;

    this.gameFinished = true;
    this.inputValue = '';

    const q = this.currentQuestion;
    if (!q) return;

    const revealedBeforeEnd = q.revealedAnswers?.length || 0;
    this.earnedPoints = calculateGamePoints(
      revealedBeforeEnd,
      q.answers.length,
      this.MAX_POINTS_MULTIPLIER
    );

    if (this.currentTeamName && this.earnedPoints > 0) {
      this.pointsService.setPoints(this.earnedPoints);
    }


    this.revealAll();
  }

  private revealAll(): void {
    if (!this.currentQuestion) return;
    this.currentQuestion.answers.forEach((_, i) => {
      if (!this.currentQuestion?.revealedAnswers?.includes(i)) {
        this.questionService.revealAnswer(i);
      }
    });
  }

  isAnswerRevealed(index: number): boolean {
    return this.currentQuestion?.revealedAnswers?.includes(index) ?? false;
  }
}
