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

  question$!: Observable<Question | null>;
  question!: Question | null;

  players: Player[] = [];
  currentPlayerIndex = 0;
  winner: Team | null = null;
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
        chancesLeft: this.MAX_CHANCES
      }));
      this.currentPlayerIndex = 0;
    });

    // Subskrypcja pytania
    this.question$.subscribe(q => {
      if (!q) return;
      this.question = q;

      // sortowanie odpowiedzi alfabetycznie (bez uwzględnienia wielkości liter)
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

    if (player.mistakes >= 3) {
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
    return this.remainingAnswers;
  }

  nextPlayer(): void {
    const alivePlayers = this.players.filter(p => p.mistakes < 3);
    if (alivePlayers.length <= 1) {
      this.finishGame();
      return;
    }

    let next = this.currentPlayerIndex;
    let attempts = 0;

    do {
      next = (next + 1) % this.players.length;
      attempts++;
    } while (this.players[next].mistakes >= 3 && attempts <= this.players.length);

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

    const alivePlayers = this.players.filter(p => p.mistakes < 3);

    if (alivePlayers.length === 1) {
      this.winner = alivePlayers[0];
    } else if (this.lastCorrectPlayer) {
      this.winner = this.lastCorrectPlayer;
    }

    if (this.winner) {
      this.gameStateService.addPoint(this.winner.id);
    }
  }

  resetGame(): void {
    this.players.forEach(p => {
      p.mistakes = 0;
      p.chancesLeft = this.MAX_CHANCES;
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
