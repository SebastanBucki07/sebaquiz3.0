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

interface Player extends Team {
  mistakes: number;
  chancesLeft: number;
  correctAnswers: number;          // ile odpowiedzi odgadli
  calculatedPoints?: number;       // lokalnie obliczone punkty
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
    MatGridListModule
  ],
  templateUrl: './writing-category.component.html',
  styleUrls: ['./writing-category.component.css']
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

  private correctAudio = new Audio('assets/sounds/correct.mp3');
  private wrongAudio = new Audio('assets/sounds/wrong.mp3');

  constructor(
    private questionService: QuestionService,
    private gameStateService: GameStateService
  ) {}

  ngOnInit(): void {
    this.question$ = this.questionService.question$;

    // Pobranie drużyn z serwisu
    this.gameStateService.teams$.subscribe(teams => {
      this.players = teams.map(team => ({
        ...team,
        mistakes: 0,
        chancesLeft: this.MAX_CHANCES,
        correctAnswers: 0,
        calculatedPoints: 0
      }));
      this.currentPlayerIndex = 0;
    });

    // Subskrypcja pytania
    this.question$.subscribe(q => {
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

  submitAnswer(): void {
    if (!this.question || !this.inputValue.trim() || this.gameFinished || !this.currentPlayer) return;
    if (!this.question.answers) return;

    const normalizedInput = this.normalize(this.inputValue);
    const answerIndex = this.question.answers.findIndex(a =>
      this.normalize(a.value) === normalizedInput
    );

    if (answerIndex >= 0) {
      const alreadyRevealed = this.question.revealedAnswers?.includes(answerIndex) ?? false;

      if (!alreadyRevealed) {
        this.questionService.revealAnswer(answerIndex);

        this.lastCorrectPlayer = this.currentPlayer;
        this.currentPlayer.correctAnswers++;

        // 🔹 OBLICZENIE PUNKTÓW DYNAMICZNIE
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
      this.revealAllAnswers();
      this.finishGame();
      return;
    }

    this.nextPlayer();
  }

  triggerWrongFlash(): void {
    this.wrongFlash = true;
    setTimeout(() => this.wrongFlash = false, 400);
  }

  getRemaining(): number {
    return (this.question?.answers?.length ?? 0) - (this.question?.revealedAnswers?.length ?? 0);
  }

  nextPlayer(): void {
    const alivePlayers = this.players.filter(p => p.mistakes < this.MAX_CHANCES);
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

    // Obliczamy lokalnie punkty procentowo dla każdej drużyny
    this.players.forEach(player => {
      const ratio = player.correctAnswers / totalAnswers;
      player.calculatedPoints = Math.ceil(ratio * this.MAX_POINTS);
    });

// aby Angular odświeżył widok
    this.players = [...this.players];


    // Wyłonienie zwycięzcy – priorytet: odgadnięte odpowiedzi, w razie remisu -> więcej szans
    const sorted = [...this.players].sort((a, b) => {
      if (b.correctAnswers === a.correctAnswers) {
        return b.chancesLeft - a.chancesLeft; // więcej szans wygrywa w remisie
      }
      return b.correctAnswers - a.correctAnswers;
    });

    this.winner = sorted[0] || null;

    // NIE DODAJEMY punktów do GameStateService — będzie zrobione w innym komponencie
  }



  resetGame(): void {
    this.players.forEach(p => {
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

  private normalize(value: string): string {
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

}
