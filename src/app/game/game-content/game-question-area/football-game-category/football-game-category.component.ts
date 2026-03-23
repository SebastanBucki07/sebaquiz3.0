import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameStateService } from '../../../../services/game-state.service';
import { GameService } from '../../../../services/game.service';
import { PointsService } from '../../../../services/points-service.service';
import { QuestionService } from '../../../../services/question-service.service';
import { Observable } from 'rxjs';
import { Question } from '../../../../shared/questions/question.interface';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { Footballer, FootballTeam } from '../../../../shared/models/answers/answerItem.interface';
import { playSound } from '../../../../shared/utils/audio-helper';
import {
  areSimilar,
  calculateGamePoints,
  normalizeText,
} from '../../../../shared/utils/text-logic';
import { generateTeamColors } from '../../../../shared/utils/color-helper';
import { FlagUrlPipe } from '../../../../shared/pipes/flag-url.pipe';
import { TeamInWritingCategory } from '../../../../shared/models/teams/teamForWrittingCategory.interface';
import {WritingScoreBoardComponent} from '../writing-category/writing-score-board/writing-score-board.component';

@Component({
  selector: 'app-football-game-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatGridListModule,
    FlagUrlPipe,
    WritingScoreBoardComponent,
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
  question!: Question | null;

  teams: TeamInWritingCategory[] = [];
  currentTeamIndex = 0;
  winner: TeamInWritingCategory | null = null;
  inputValue = '';
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
      if (!q) return;
      this.question = q;
      const football = q.answers?.[0]?.football;
      if (!football) return;

      const cloneFootballer = (p: Footballer) => ({ ...p, guessed: false, guessedBy: undefined });
      const cloneTeam = (team: FootballTeam) => ({
        ...team,
        footballers: team.footballers.map(cloneFootballer),
        substitutes: team.substitutes?.map(cloneFootballer) ?? [],
      });

      this.firstRows = this.buildRows(cloneTeam(football.firstTeam));
      this.secondRows = this.buildRows(cloneTeam(football.secondTeam), true);
      this.firstSubstitutes = cloneTeam(football.firstTeam).substitutes;
      this.secondSubstitutes = cloneTeam(football.secondTeam).substitutes;

      this.remainingAnswers = this.getAllFootballersCount();
    });
  }

  get activeTeamId(): number | null {
    return this.currentTeam?.id ?? null;
  }

  get currentTeam(): TeamInWritingCategory | null {
    return this.teams.length > 0 ? this.teams[this.currentTeamIndex] : null;
  }

  submitAnswer(): void {
    if (!this.currentTeam || !this.inputValue.trim() || this.gameFinished) return;

    const needle = normalizeText(this.inputValue);

    const allFootballers = [
      ...this.firstRows.flat(),
      ...this.secondRows.flat(),
      ...this.firstSubstitutes,
      ...this.secondSubstitutes,
    ];

    let footballer =
      allFootballers.find((p) => !p.guessed && normalizeText(p.surname) === needle) ||
      allFootballers.find((p) => !p.guessed && areSimilar(needle, p.surname));

    if (footballer) {
      footballer.guessed = true;
      footballer.guessedBy = this.currentTeam.name;
      this.currentTeam.correctAnswers++;
      this.updateLivePoints();

      playSound('sounds/1z10dobrzee.mp3');
      this.remainingAnswers--;
      this.refreshView();

      if (this.remainingAnswers <= 0) {
        this.finishGame();
      } else {
        this.nextTeam();
      }
    } else {
      this.currentTeam.mistakes++;
      this.currentTeam.chancesLeft--;
      playSound('sounds/1z10zle.mp3');
      this.nextTeam();
    }
    this.inputValue = '';
  }

  private updateLivePoints(): void {
    const total = this.getAllFootballersCount();
    this.teams.forEach((p) => {
      p.calculatedPoints = calculateGamePoints(p.correctAnswers, total, this.MAX_POINTS);
    });
  }

  private finishGame(): void {
    this.gameFinished = true;
    const totalFootballers = this.getAllFootballersCount();

    // 1. LOGIKA ODKRYWANIA WSZYSTKICH ZAWODNIKÓW
    // Musimy przelecieć przez każdą strukturę i ustawić guessed = true

    const reveal = (p: Footballer) => {
      p.guessed = true;
    };

    this.firstRows.forEach((row) => row.forEach(reveal));
    this.secondRows.forEach((row) => row.forEach(reveal));
    this.firstSubstitutes.forEach(reveal);
    this.secondSubstitutes.forEach(reveal);

    // Wymuszamy odświeżenie widoku przez zmianę referencji (immutability)
    this.refreshView();

    // 2. SORTOWANIE I WYŁONIENIE ZWYCIĘZCY
    const sorted = [...this.teams].sort((a, b) => {
      if (b.correctAnswers === a.correctAnswers) {
        return b.chancesLeft - a.chancesLeft;
      }
      return b.correctAnswers - a.correctAnswers;
    });

    this.winner = sorted[0] ?? null;

    if (this.winner) {
      const winnerPoints = calculateGamePoints(
        this.winner.correctAnswers,
        totalFootballers,
        this.MAX_POINTS
      );

      this.pointsService.setPoints(winnerPoints);
      this.gameService.setCurrentTeam(this.winner.name);
    }
  }

  nextTeam(): void {
    const aliveTeams = this.teams.filter((p) => p.mistakes < this.MAX_CHANCES);
    if (aliveTeams.length <= 1) {
      this.finishGame();
      return;
    }

    let next = this.currentTeamIndex;
    let attempts = 0;
    do {
      next = (next + 1) % this.teams.length;
      attempts++;
    } while (this.teams[next].mistakes >= this.MAX_CHANCES && attempts <= this.teams.length);

    this.currentTeamIndex = next;
  }

  protected getAllFootballersCount(): number {
    const football = this.question?.answers?.[0]?.football;
    if (!football) return 0;
    return [
      ...football.firstTeam.footballers,
      ...(football.firstTeam.substitutes ?? []),
      ...football.secondTeam.footballers,
      ...(football.secondTeam.substitutes ?? []),
    ].length;
  }

  private buildRows(team: FootballTeam, reverse = false): Footballer[][] {
    const footballers = [...team.footballers];
    const formation = team.formation.split('-').map((n) => +n);
    const rows: Footballer[][] = [];
    formation.forEach((count) => rows.push(footballers.splice(0, count)));
    return reverse ? rows.reverse() : rows;
  }

  private refreshView(): void {
    this.firstRows = [...this.firstRows];
    this.secondRows = [...this.secondRows];
    this.firstSubstitutes = [...this.firstSubstitutes];
    this.secondSubstitutes = [...this.secondSubstitutes];
  }

  protected readonly Math = Math;
}
