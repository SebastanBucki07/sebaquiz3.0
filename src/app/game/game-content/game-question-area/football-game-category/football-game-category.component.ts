import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

// Angular Material
import { MatCardModule } from '@angular/material/card';

// Services
import { GameStateService } from '../../../../services/game-state.service';
import { GameService } from '../../../../services/game.service';
import { PointsService } from '../../../../services/points-service.service';
import { QuestionService } from '../../../../services/question-service.service';

// Interfaces & Models
import { Question } from '../../../../shared/questions/question.interface';
import { Footballer, FootballTeam } from '../../../../shared/models/answers/answerItem.interface';
import { TeamInWritingCategory } from '../../../../shared/models/teams/teamForWrittingCategory.interface';

// Utils & Helpers
import { playSound } from '../../../../shared/utils/audio-helper';
import {
  areSimilar,
  calculateGamePoints,
  normalizeText,
} from '../../../../shared/utils/text-logic';
import { generateTeamColors } from '../../../../shared/utils/color-helper';

// Pipes & Components
import { FlagUrlPipe } from '../../../../shared/pipes/flag-url.pipe';
import { WritingScoreBoardComponent } from '../writing-category/writing-score-board/writing-score-board.component';
import { WritingControlsComponent } from '../writing-category/writting-controls/writing-controls.component';
import { WritingGameStatusComponent } from '../writing-category/writing-game-status/writing-game-status.component';

@Component({
  selector: 'app-football-game-category',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    FlagUrlPipe,
    WritingScoreBoardComponent,
    WritingControlsComponent,
    WritingGameStatusComponent,
  ],
  templateUrl: './football-game-category.component.html',
  styleUrls: ['./football-game-category.component.css'],
})
export class FootballGameCategoryComponent implements OnInit {
  readonly MAX_CHANCES = 3;
  readonly MAX_POINTS = 10;

  firstRows: Footballer[][] = [];
  secondRows: Footballer[][] = [];
  firstSubstitutes: Footballer[] = [];
  secondSubstitutes: Footballer[] = [];

  question$!: Observable<Question | null>;
  question: Question | null = null;
  teams: TeamInWritingCategory[] = [];
  currentTeamIndex = 0;
  winner: TeamInWritingCategory | null = null;
  gameFinished = false;
  remainingAnswers = 0;

  constructor(
    private questionService: QuestionService,
    private gameStateService: GameStateService,
    private gameService: GameService,
    private pointsService: PointsService
  ) {}

  ngOnInit(): void {
    this.question$ = this.questionService.question$;

    this.gameStateService.teams$.subscribe((teams) => {
      const colors = generateTeamColors(teams.length);
      this.teams = teams.map((team, i) => ({
        ...team,
        mistakes: 0,
        chancesLeft: this.MAX_CHANCES,
        correctAnswers: 0,
        calculatedPoints: 0,
        color: colors[i],
      }));
    });

    this.question$.subscribe((q) => {
      if (!q || !q.answers?.[0]?.football) return;
      this.question = q;

      const football = q.answers[0].football;
      const processTeam = (team: FootballTeam) => ({
        ...team,
        footballers: team.footballers.map((p) => ({ ...p, guessed: false })),
        substitutes: (team.substitutes || []).map((p) => ({ ...p, guessed: false })),
      });

      const t1 = processTeam(football.firstTeam);
      const t2 = processTeam(football.secondTeam);

      this.firstRows = this.buildRows(t1);
      this.secondRows = this.buildRows(t2, true);
      this.firstSubstitutes = t1.substitutes;
      this.secondSubstitutes = t2.substitutes;

      this.remainingAnswers = this.getAllFootballersCount();
    });
  }

  get activeTeamId(): number | null {
    return this.currentTeam?.id ?? null;
  }

  get currentTeam(): TeamInWritingCategory | null {
    return this.teams[this.currentTeamIndex] || null;
  }

  submitAnswer(value: string): void {
    if (!this.currentTeam || !value.trim() || this.gameFinished) return;

    const needle = normalizeText(value);
    const all = [
      ...this.firstRows.flat(),
      ...this.secondRows.flat(),
      ...this.firstSubstitutes,
      ...this.secondSubstitutes,
    ];

    const footballer = all.find(
      (p) => !p.guessed && (normalizeText(p.surname) === needle || areSimilar(needle, p.surname))
    );

    if (footballer) {
      footballer.guessed = true;
      footballer.guessedBy = this.currentTeam.name;
      this.currentTeam.correctAnswers++;
      this.updateLivePoints();
      playSound('sounds/1z10dobrzee.mp3');
      this.remainingAnswers--;
      this.refreshView();

      this.remainingAnswers <= 0 ? this.finishGame() : this.nextTeam();
    } else {
      this.currentTeam.mistakes++;
      this.currentTeam.chancesLeft--;
      playSound('sounds/1z10zle.mp3');
      this.nextTeam();
    }
  }

  private updateLivePoints(): void {
    const total = this.getAllFootballersCount();
    this.teams.forEach((t) => {
      t.calculatedPoints = calculateGamePoints(t.correctAnswers, total, this.MAX_POINTS);
    });
  }

  private finishGame(): void {
    if (this.gameFinished) return;
    this.gameFinished = true;

    const reveal = (p: Footballer) => (p.guessed = true);
    this.firstRows.forEach((row) => row.forEach(reveal));
    this.secondRows.forEach((row) => row.forEach(reveal));
    this.firstSubstitutes.forEach(reveal);
    this.secondSubstitutes.forEach(reveal);

    this.refreshView();

    this.winner =
      [...this.teams].sort(
        (a, b) => b.correctAnswers - a.correctAnswers || b.chancesLeft - a.chancesLeft
      )[0] || null;

    if (this.winner) {
      // NAPRAWA BŁĘDU TYPOWANIA:
      const points = this.winner.calculatedPoints ?? 0;
      this.pointsService.setPoints(points);
      this.gameService.setCurrentTeam(this.winner.name);
    }
  }

  nextTeam(): void {
    const alive = this.teams.filter((t) => t.mistakes < this.MAX_CHANCES);
    if (alive.length <= 1) {
      this.finishGame();
      return;
    }

    do {
      this.currentTeamIndex = (this.currentTeamIndex + 1) % this.teams.length;
    } while (this.teams[this.currentTeamIndex].mistakes >= this.MAX_CHANCES);
  }

  private getAllFootballersCount(): number {
    const f = this.question?.answers?.[0]?.football;
    if (!f) return 0;

    const t1Count = f.firstTeam.footballers.length + (f.firstTeam.substitutes?.length || 0);
    const t2Count = f.secondTeam.footballers.length + (f.secondTeam.substitutes?.length || 0);

    return t1Count + t2Count;
  }

  private buildRows(team: FootballTeam, reverse = false): Footballer[][] {
    const footballers = [...team.footballers];
    const rows: Footballer[][] = [];
    const formationParts = team.formation.split('-');

    formationParts.forEach((countStr) => {
      const count = parseInt(countStr, 10) || 0;
      rows.push(footballers.splice(0, count));
    });

    return reverse ? rows.reverse() : rows;
  }

  private refreshView(): void {
    this.firstRows = [...this.firstRows];
    this.secondRows = [...this.secondRows];
    this.firstSubstitutes = [...this.firstSubstitutes];
    this.secondSubstitutes = [...this.secondSubstitutes];
  }
}
