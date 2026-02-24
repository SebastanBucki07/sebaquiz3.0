import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { QuestionService } from '../../../../shared/question-service.service';
import { Question } from '../../../../shared/questions/question.interface';
import { Observable } from 'rxjs';
import { GameStateService, Team } from '../../../../shared/game-state.service';
import { PointsService } from '../../../../shared/points-service.service';
import { GameService } from '../../../../shared/game.service';

interface Player extends Team {
  mistakes: number;
  chancesLeft: number;
  correctAnswers: number; // ile odpowiedzi odgadli
  calculatedPoints?: number;
  color: string;
}

@Component({
  selector: 'app-writing-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatGridListModule,
  ],
  templateUrl: './writing-category.component.html',
  styleUrls: ['./writing-category.component.css'],
})
export class WritingCategoryComponent implements OnInit {
  readonly MAX_CHANCES = 3;
  readonly MAX_POINTS = 10;

  question$!: Observable<Question | null>;
  question!: Question | null;

  players: Player[] = [];
  currentPlayerIndex = 0;
  winner: Player | null = null;
  inputValue = '';
  gameFinished = false;
  lastCorrectPlayer: Team | null = null;
  remainingAnswers = 0;
  wrongFlash = false;
  answerOwners: { [key: number]: number } = {};

  private correctAudio = new Audio('/sounds/1z10dobrzee.mp3');
  private wrongAudio = new Audio('/sounds/1z10zle.mp3');

  constructor(
    private questionService: QuestionService,
    private gameStateService: GameStateService,
    private gameService: GameService,
    private pointsService: PointsService
  ) {}

  ngOnInit(): void {
    this.question$ = this.questionService.question$;

    this.gameStateService.teams$.subscribe((teams) => {
      const colors = this.generateTeamColor(teams.length);

      this.players = teams.map((team, index) => ({
        ...team,
        mistakes: 0,
        chancesLeft: this.MAX_CHANCES,
        correctAnswers: 0,
        calculatedPoints: 0,
        color: colors[index],
      }));

      this.currentPlayerIndex = 0;
    });

    // Subskrypcja pytania
    this.question$.subscribe((q) => {
      if (!q) return;
      this.question = q;

      // sortowanie odpowiedzi alfabetycznie
      this.question.answers = [...q.answers].sort((a, b) =>
        a.value.toLowerCase().localeCompare(b.value.toLowerCase())
      );

      this.remainingAnswers = this.question.answers.length;
    });
  }

  get currentPlayer(): Player | null {
    return this.players.length > 0 ? this.players[this.currentPlayerIndex] : null;
  }

  get activePlayerId(): number | null {
    return this.currentPlayer?.id ?? null;
  }

  private generateTeamColor(count: number): string[] {
    const colors: string[] = [];

    const baseHue = Math.floor(Math.random() * 360);
    const saturation = 75;
    const lightness = 45;

    for (let i = 0; i < count; i++) {
      const hue = (baseHue + (360 / count) * i) % 360;
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }

    return colors;
  }

  getOwnerName(answerIndex: number): string | null {
    const ownerId = this.answerOwners[answerIndex];
    if (!ownerId) return null;

    const player = this.players.find((player) => player.id === ownerId);
    return player ? player.name : null;
  }

  getAnswerColor(index: number): string {
    const ownerId = this.answerOwners[index];
    if (!ownerId) return '';

    const player = this.players.find((p) => p.id === ownerId);
    return player ? player.color : '';
  }

  submitAnswer(): void {
    if (!this.question || !this.inputValue.trim() || this.gameFinished || !this.currentPlayer)
      return;
    if (!this.question.answers) return;

    const normalizedInput = this.normalize(this.inputValue);

    // 1️⃣ Najpierw sprawdzamy dokładne dopasowanie
    let answerIndex = this.question.answers.findIndex(
      (a) => this.normalize(a.value) === normalizedInput
    );

    // 2️⃣ Jeśli nie znaleziono dokładnego — dopiero wtedy fuzzy
    if (answerIndex === -1) {
      answerIndex = this.question.answers.findIndex((a) =>
        this.areSimilar(normalizedInput, a.value)
      );
    }

    if (answerIndex >= 0) {
      const alreadyRevealed = this.question.revealedAnswers?.includes(answerIndex) ?? false;

      if (!alreadyRevealed) {
        this.questionService.revealAnswer(answerIndex);

        // 🔥 zapamiętujemy kto odgadł
        this.answerOwners[answerIndex] = this.currentPlayer.id;

        this.lastCorrectPlayer = this.currentPlayer;
        this.currentPlayer.correctAnswers++;

        // 🔹 OBLICZENIE PUNKTÓW DYNAMICZNIE (always ceil)
        const totalAnswers = this.question?.answers.length ?? 1;
        this.currentPlayer.calculatedPoints = Math.ceil(
          (this.currentPlayer.correctAnswers / totalAnswers) * this.MAX_POINTS
        );

        this.correctAudio.currentTime = 0;
        this.correctAudio.play();

        this.remainingAnswers--;
        this.checkIfAllRevealed();
        this.inputValue = '';
        return;
      }
    }

    this.handleMistake();
    this.inputValue = '';
  }

  handleMistake(): void {
    const player = this.currentPlayer!;
    player.mistakes++;
    player.chancesLeft--;

    this.wrongAudio.currentTime = 0;
    this.wrongAudio.play();
    this.triggerWrongFlash();

    if (player.mistakes >= this.MAX_CHANCES) {
      const alivePlayers = this.players.filter((p) => p.mistakes < this.MAX_CHANCES);

      if (alivePlayers.length <= 1) {
        this.revealAllAnswers();
        this.finishGame();
        return;
      }

      this.nextPlayer();
      return;
    }

    this.nextPlayer();
  }

  triggerWrongFlash(): void {
    this.wrongFlash = true;
    setTimeout(() => (this.wrongFlash = false), 400);
  }

  getRemaining(): number {
    return (this.question?.answers?.length ?? 0) - (this.question?.revealedAnswers?.length ?? 0);
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

  revealAllAnswers(): void {
    if (!this.question) return;
    this.question.answers?.forEach((_, index) => this.questionService.revealAnswer(index));
  }

  checkIfAllRevealed(): void {
    if (!this.question) return;

    if (this.question.revealedAnswers?.length === this.question.answers?.length) {
      this.finishGame();
    } else {
      this.nextPlayer();
    }
  }

  finishGame(): void {
    this.gameFinished = true;
    if (!this.question) return;

    const totalAnswers = this.question.answers?.length ?? 0;
    if (totalAnswers === 0) return;

    // Obliczamy punkty dla każdej drużyny/gracza
    this.players.forEach((player) => {
      const ratio = player.correctAnswers / totalAnswers;
      player.calculatedPoints = Math.ceil(ratio * this.MAX_POINTS);
    });

    this.players = [...this.players];

    // Wyłonienie zwycięzcy
    const sorted = [...this.players].sort((a, b) => {
      if (b.correctAnswers === a.correctAnswers) {
        return b.chancesLeft - a.chancesLeft;
      }
      return b.correctAnswers - a.correctAnswers;
    });

    this.winner = sorted[0] || null;

    if (this.winner) {
      // ustaw aktualną drużynę na zwycięzcę
      this.gameService.setCurrentTeam(this.winner.name);

      // ustaw dostępne punkty na obiekt zwycięzcy
      this.pointsService.setPoints(this.winner.calculatedPoints ?? 0);
    }
  }

  resetGame(): void {
    this.players.forEach((p) => {
      p.mistakes = 0;
      p.chancesLeft = this.MAX_CHANCES;
      p.correctAnswers = 0;
      p.calculatedPoints = 0;
    });
    this.currentPlayerIndex = 0;
    this.gameFinished = false;
    this.lastCorrectPlayer = null;
  }

  isRevealed(index: number): boolean {
    return this.question?.revealedAnswers?.includes(index) ?? false;
  }

  // 🔹 Normalizacja: małe litery, polskie znaki, - traktujemy jak spację, redukcja spacji
  private normalize(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/-/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // 🔹 Sprawdzenie zgodności odpowiedzi z tolerancją literówek i zamianą słów
  private areSimilar(input: string, answer: string): boolean {
    const normInput = this.normalize(input);
    const normAnswer = this.normalize(answer);

    // dokładne dopasowanie zawsze
    if (normInput === normAnswer) return true;

    // sprawdzamy zamianę kolejności słów (Robert Lewandowski ↔ Lewandowski Robert)
    const inputWords = normInput
      .split(/[\s-]+/)
      .sort()
      .join(' ');
    const answerWords = normAnswer
      .split(/[\s-]+/)
      .sort()
      .join(' ');
    if (inputWords === answerWords) return true;

    // ustalamy maksymalną liczbę literówek
    const maxEdits = normAnswer.length >= 7 ? 3 : 1;

    // dopuszczamy literówki
    return this.levenshtein(normInput, normAnswer) <= maxEdits;
  }

  // 🔹 Funkcja Levenshtein (do literówek)
  private levenshtein(a: string, b: string): number {
    const matrix: number[][] = Array.from({ length: a.length + 1 }, () =>
      new Array(b.length + 1).fill(0)
    );

    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // usunięcie
          matrix[i][j - 1] + 1, // wstawienie
          matrix[i - 1][j - 1] + cost // zamiana
        );
      }
    }
    return matrix[a.length][b.length];
  }

  awardPointsToTeam(teamName: string, points: number): void {
    if (!teamName || points <= 0) return;
  }
}
