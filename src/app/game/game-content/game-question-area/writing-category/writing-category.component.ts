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

interface Player {
  id: number;
  name: string;
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
  styleUrl: './writing-category.component.css'
})
export class WritingCategoryComponent implements OnInit {

  question$!: Observable<Question | null>;
  question!: Question | null;

  players: Player[] = [
    { id: 1, name: 'Gracz 1', mistakes: 0, chancesLeft: 2 },
    { id: 2, name: 'Gracz 2', mistakes: 0, chancesLeft: 2 }
  ];

  currentPlayerIndex = 0;
  inputValue = '';
  gameFinished = false;
  lastCorrectPlayer: Player | null = null;

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.question$ = this.questionService.question$;

    this.question$.subscribe(q => {
      this.question = q;
      this.resetGame();
    });
  }

  get currentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }

  submitAnswer(): void {
    if (!this.question || !this.inputValue.trim() || this.gameFinished) return;
    if (!this.question.answers) return;

    const normalizedInput = this.normalize(this.inputValue);

    const answerIndex = this.question.answers.findIndex(a =>
      this.normalize(a.value) === normalizedInput
    );

    if (answerIndex >= 0) {

      const alreadyRevealed =
        this.question.revealedAnswers?.includes(answerIndex) ?? false;

      if (!alreadyRevealed) {
        this.questionService.revealAnswer(answerIndex);
        this.lastCorrectPlayer = this.currentPlayer;
        this.checkIfAllRevealed();
        this.inputValue = '';
        return;
      }
    }

    this.handleMistake();
    this.inputValue = '';
  }



  handleMistake(): void {
    const player = this.currentPlayer;
    player.mistakes++;
    player.chancesLeft--;

    if (player.mistakes >= 3) {
      this.revealAllAnswers();
      this.finishGame();
      return;
    }

    this.nextPlayer();
  }

  nextPlayer(): void {
    let next = (this.currentPlayerIndex + 1) % this.players.length;

    while (this.players[next].chancesLeft <= 0) {
      next = (next + 1) % this.players.length;
    }

    this.currentPlayerIndex = next;
  }

  revealAllAnswers(): void {
    if (!this.question) return;

    this.question.answers?.forEach((_, index) => {
      this.questionService.revealAnswer(index);
    });
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
  }

  resetGame(): void {
    this.players.forEach(p => {
      p.mistakes = 0;
      p.chancesLeft = 2;
    });
    this.currentPlayerIndex = 0;
    this.gameFinished = false;
    this.lastCorrectPlayer = null;
  }

  isRevealed(index: number): boolean {
    return this.question?.revealedAnswers?.includes(index) ?? false;
  }


  private normalize(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD') // rozdziela znaki diakrytyczne
      .replace(/[\u0300-\u036f]/g, '') // usuwa ogonki
      .trim();
  }



}
