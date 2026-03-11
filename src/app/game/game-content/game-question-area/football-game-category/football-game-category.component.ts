import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameStateService, Team } from '../../../../shared/game-state.service';
import { GameService } from '../../../../shared/game.service';
import { PointsService } from '../../../../shared/points-service.service';
import { QuestionService } from '../../../../shared/question-service.service';
import { Observable } from 'rxjs';
import { Question } from '../../../../shared/questions/question.interface';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { footballPlayer, footballTeam } from '../../../../shared/answers/answerItem.interface';
import { playSound } from '../../../../shared/utils/audio-helper';
import {
  areSimilar,
  calculateGamePoints,
  normalizeText,
} from '../../../../shared/utils/text-logic';
import { generateTeamColors } from '../../../../shared/utils/color-helper';

interface Player extends Team {
  mistakes: number;
  chancesLeft: number;
  correctAnswers: number;
  calculatedPoints?: number;
  color: string;
}

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
  ],
  templateUrl: './football-game-category.component.html',
  styleUrls: ['./football-game-category.component.css'],
})
export class FootballGameCategoryComponent implements OnInit {
  readonly MAX_CHANCES = 3;
  readonly MAX_POINTS = 10;

  firstRows: footballPlayer[][] = [];
  secondRows: footballPlayer[][] = [];
  firstSubstitutes: footballPlayer[] = [];
  secondSubstitutes: footballPlayer[] = [];

  question$!: Observable<Question | null>;
  question!: Question | null;

  players: Player[] = [];
  currentPlayerIndex = 0;
  winner: Player | null = null;
  inputValue = '';
  gameFinished = false;
  remainingAnswers = 0;

  // private correctAudio = new Audio('/sounds/1z10dobrzee.mp3');
  // private wrongAudio = new Audio('/sounds/1z10zle.mp3');

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
      this.players = teams.map((team, i) => ({
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

      const clonePlayer = (p: footballPlayer) => ({ ...p, guessed: false, guessedBy: undefined });
      const cloneTeam = (team: footballTeam) => ({
        ...team,
        footballers: team.footballers.map(clonePlayer),
        substitutes: team.substitutes?.map(clonePlayer) ?? [],
      });

      this.firstRows = this.buildRows(cloneTeam(football.firstTeam));
      this.secondRows = this.buildRows(cloneTeam(football.secondTeam), true);
      this.firstSubstitutes = cloneTeam(football.firstTeam).substitutes;
      this.secondSubstitutes = cloneTeam(football.secondTeam).substitutes;

      this.remainingAnswers = this.getAllPlayersCount();
    });
  }

  get activePlayerId(): number | null {
    return this.currentPlayer?.id ?? null;
  }

  get currentPlayer(): Player | null {
    return this.players.length > 0 ? this.players[this.currentPlayerIndex] : null;
  }

  submitAnswer(): void {
    if (!this.currentPlayer || !this.inputValue.trim() || this.gameFinished) return;

    const needle = normalizeText(this.inputValue);

    const allPlayers = [
      ...this.firstRows.flat(),
      ...this.secondRows.flat(),
      ...this.firstSubstitutes,
      ...this.secondSubstitutes,
    ];

    let player =
      allPlayers.find((p) => !p.guessed && normalizeText(p.surname) === needle) ||
      allPlayers.find((p) => !p.guessed && areSimilar(needle, p.surname));

    if (player) {
      player.guessed = true;
      player.guessedBy = this.currentPlayer.name;
      this.currentPlayer.correctAnswers++;
      this.updateLivePoints();

      playSound('sounds/1z10dobrzee.mp3');
      this.remainingAnswers--;
      this.refreshView();

      if (this.remainingAnswers <= 0) {
        this.finishGame();
      } else {
        this.nextPlayer();
      }
    } else {
      this.currentPlayer.mistakes++;
      this.currentPlayer.chancesLeft--;
      playSound('sounds/1z10zle.mp3');
      this.nextPlayer();
    }
    this.inputValue = '';
  }

  private updateLivePoints(): void {
    const total = this.getAllPlayersCount();
    this.players.forEach((p) => {
      p.calculatedPoints = calculateGamePoints(p.correctAnswers, total, this.MAX_POINTS);
    });
  }

  private finishGame(): void {
    this.gameFinished = true;
    const totalPlayers = this.getAllPlayersCount();

    // ... logika odkrywania wszystkich zawodników (bez zmian) ...

    // SORTOWANIE:
    // 1. Najpierw sprawdzamy kto ma więcej poprawnych odpowiedzi.
    // 2. Jeśli jest remis, sprawdzamy kto ma WIĘCEJ pozostałych szans (chancesLeft).
    const sorted = [...this.players].sort((a, b) => {
      if (b.correctAnswers === a.correctAnswers) {
        return b.chancesLeft - a.chancesLeft;
      }
      return b.correctAnswers - a.correctAnswers;
    });

    this.winner = sorted[0] ?? null;

    if (this.winner) {
      // Obliczamy punkty dla zwycięzcy (używając Twojego helpera dla spójności)
      const winnerPoints = calculateGamePoints(
        this.winner.correctAnswers,
        totalPlayers,
        this.MAX_POINTS
      );

      this.pointsService.setPoints(winnerPoints);
      this.gameService.setCurrentTeam(this.winner.name);
    }
  }

  nextPlayer(): void {
    const alivePlayers = this.players.filter((p) => p.mistakes < this.MAX_CHANCES);
    if (alivePlayers.length <= 1) {
      this.finishGame();
      return;
    }

    let next = this.currentPlayerIndex;
    let attempts = 0;
    do {
      next = (next + 1) % this.players.length;
      attempts++;
    } while (this.players[next].mistakes >= this.MAX_CHANCES && attempts <= this.players.length);

    this.currentPlayerIndex = next;
  }

  protected getAllPlayersCount(): number {
    const football = this.question?.answers?.[0]?.football;
    if (!football) return 0;
    return [
      ...football.firstTeam.footballers,
      ...(football.firstTeam.substitutes ?? []),
      ...football.secondTeam.footballers,
      ...(football.secondTeam.substitutes ?? []),
    ].length;
  }

  private buildRows(team: footballTeam, reverse = false): footballPlayer[][] {
    const players = [...team.footballers];
    const formation = team.formation.split('-').map((n) => +n);
    const rows: footballPlayer[][] = [];
    formation.forEach((count) => rows.push(players.splice(0, count)));
    return reverse ? rows.reverse() : rows;
  }

  private refreshView(): void {
    this.firstRows = [...this.firstRows];
    this.secondRows = [...this.secondRows];
    this.firstSubstitutes = [...this.firstSubstitutes];
    this.secondSubstitutes = [...this.secondSubstitutes];
  }

  isCountryCode(c: string | undefined): boolean {
    return !!c && /^[A-Za-z]{2}$/.test(c.trim());
  }

  flagPngUrl(code: string): string {
    if (!code) return '';
    return `https://flagcdn.com/w80/${code.trim().toLowerCase()}.png`;
  }

  protected readonly Math = Math;
}
