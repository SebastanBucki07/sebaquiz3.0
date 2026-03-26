import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable, take} from 'rxjs';

// Services
import {QuestionService} from '../../../../services/question-service.service';
import {GameStateService} from '../../../../services/game-state.service';
import {PointsService} from '../../../../services/points-service.service';
import {GameService} from '../../../../services/game.service';

// Models & Utils
import {Question} from '../../../../shared/questions/question.interface';
import {TeamInWritingCategory} from '../../../../shared/models/teams/teamForWrittingCategory.interface';
import {generateTeamColors} from '../../../../shared/utils/color-helper';

// Components
import {WritingScoreBoardComponent} from './writing-score-board/writing-score-board.component';
import {WritingControlsComponent} from './writting-controls/writing-controls.component';
import {WritingGameStatusComponent} from './writing-game-status/writing-game-status.component';
import {MATERIAL_IMPORTS} from '../../../../shared/material';
import {WritingGameCoreService} from '../../../../services/writting-game-core.service';

@Component({
  selector: 'app-writing-category',
  standalone: true,
  imports: [
    CommonModule,
    WritingScoreBoardComponent,
    WritingControlsComponent,
    WritingGameStatusComponent,
    MATERIAL_IMPORTS,
  ],
  templateUrl: './writing-category.component.html',
  styleUrls: ['./writing-category.component.css'],
})
export class WritingCategoryComponent implements OnInit {
  readonly MAX_CHANCES = 3;
  readonly MAX_POINTS = 10;

  question$!: Observable<Question | null>;
  question: Question | null = null;

  teams: TeamInWritingCategory[] = [];
  currentTeamIndex = 0;
  winner: TeamInWritingCategory | null = null;
  gameFinished = false;
  wrongFlash = false;
  answerOwners: { [key: number]: number } = {};

  constructor(
    private questionService: QuestionService,
    private gameStateService: GameStateService,
    private gameService: GameService,
    private pointsService: PointsService,
    public gameCore: WritingGameCoreService
  ) {
  }

  ngOnInit(): void {
    this.question$ = this.questionService.question$;

    this.gameStateService.teams$.pipe(take(1)).subscribe((teams) => {
      const colors = generateTeamColors(teams.length);
      this.teams = teams.map((team, index) => ({
        ...team,
        mistakes: 0,
        chancesLeft: this.MAX_CHANCES,
        correctAnswers: 0,
        calculatedPoints: 0,
        color: colors[index],
      }));
    });

    this.gameCore.wrongFlash$.subscribe(isFlashing => {
      this.wrongFlash = isFlashing;
    });

    this.question$.subscribe((q) => {
      if (!q) return;
      this.question = {
        ...q,
        answers: [...q.answers].sort((a, b) => a.value.localeCompare(b.value)),
      };
    });
  }

  get currentTeam(): TeamInWritingCategory | null {
    return this.teams[this.currentTeamIndex] || null;
  }

  getOwnerName(index: number): string | null {
    return this.teams.find((t) => t.id === this.answerOwners[index])?.name || null;
  }

  getAnswerColor(index: number): string {
    return this.teams.find((t) => t.id === this.answerOwners[index])?.color || '';
  }

  submitAnswer(value: string): void {
    // 1. Guardy (czy gra trwa i czy jest input)
    if (!this.question || this.gameFinished || !this.currentTeam || !value.trim()) return;

    const input = value.trim();

    // 2. Szukamy indeksu odpowiedzi (używamy map, aby wyciągnąć same teksty)
    const allValues = this.question.answers.map(a => a.value);
    const ansIdx = this.gameCore.validateAnswer(
      input,
      allValues,
      this.question.revealedAnswers || []
    );

    // 3. Logika trafienia lub błędu
    if (ansIdx >= 0) {
      this.handleCorrectAnswer(ansIdx);
    } else {
      this.handleMistake();
    }
  }

  private handleCorrectAnswer(index: number): void {
    const team = this.currentTeam!;

    // Efekty i ujawnienie
    this.gameCore.triggerCorrectEffects();
    this.questionService.revealAnswer(index);

    // Rejestracja właściciela (kto zgadł, ten ma kolor na tablicy)
    this.answerOwners[index] = team.id;
    team.correctAnswers++;

    this.updatePoints();

    // Sprawdzenie czy runda trwa dalej
    this.getRemaining() === 0 ? this.finishGame() : this.nextTeam();
  }

  private handleMistake(): void {
    const team = this.currentTeam!;
    team.mistakes++;
    team.chancesLeft--;

    // Wizualny błysk i dźwięk X
    this.gameCore.triggerWrongEffects();

    // Sprawdzamy czy został ktoś żywy
    const aliveTeams = this.teams.filter((t) => t.mistakes < this.MAX_CHANCES);
    if (aliveTeams.length <= 1) {
      this.finishGame();
    } else {
      this.nextTeam();
    }
  }

  private updatePoints(): void {
    const total = this.question?.answers.length || 1;
    this.teams.forEach((t) => {
      t.calculatedPoints = Math.ceil((t.correctAnswers / total) * this.MAX_POINTS);
    });
  }

  getRemaining(): number {
    return (this.question?.answers.length || 0) - (this.question?.revealedAnswers?.length || 0);
  }

  nextTeam(): void {
    const aliveCount = this.teams.filter((t) => t.mistakes < this.MAX_CHANCES).length;
    if (aliveCount <= 1) return;

    do {
      this.currentTeamIndex = (this.currentTeamIndex + 1) % this.teams.length;
    } while (this.teams[this.currentTeamIndex].mistakes >= this.MAX_CHANCES);
  }

  finishGame(): void {
    if (this.gameFinished) return;
    this.gameFinished = true;

    if (this.getRemaining() > 0) {
      this.question?.answers.forEach((_, i) => {
        if (!this.isRevealed(i)) {
          this.questionService.revealAnswer(i);
        }
      });
    }

    const totalAnswers = this.question?.answers.length || 1;

    this.teams.forEach(team => {
      team.calculatedPoints = this.gameCore.calculateFinalScore(
        team.correctAnswers,
        totalAnswers,
        team.mistakes,
        this.MAX_CHANCES,
        this.MAX_POINTS
      );
    });

    this.winner = [...this.teams].sort((a, b) =>
      (b.calculatedPoints ?? 0) - (a.calculatedPoints ?? 0) ||
      b.chancesLeft - a.chancesLeft
    )[0] || null;

    if (this.winner) {
      this.gameService.setCurrentTeam(this.winner.name);

      const pointsToSet = this.winner.calculatedPoints ?? 0;
      this.pointsService.setPoints(pointsToSet);
    }
  }

  isRevealed(index: number): boolean {
    return this.question?.revealedAnswers?.includes(index) ?? false;
  }

}
