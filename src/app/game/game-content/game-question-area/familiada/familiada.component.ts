import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../../../shared/question-service.service';
import { Question } from '../../../../shared/questions/question.interface';
import { Observable } from 'rxjs';
import { GameService } from '../../../../shared/game.service';
import { PointsService } from '../../../../shared/points-service.service';

@Component({
  selector: 'app-familiada',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './familiada.component.html',
  styleUrls: ['./familiada.component.css'],
})
export class FamiliadaComponent implements OnInit {
  readonly MAX_CHANCES = 3;
  MAX_POINTS_MULTIPLIER = 5;

  question$!: Observable<Question | null>;
  question: Question | null = null;

  currentTeamName: string | null = null;
  mistakes = 0;
  correctAnswersCount = 0;
  gameFinished = false;
  inputValue = '';
  earnedPoints = 0;

  private correctAudio = new Audio('/sounds/1z10dobrzee.mp3');
  private wrongAudio = new Audio('/sounds/1z10zle.mp3');

  constructor(
    private questionService: QuestionService,
    private gameService: GameService,
    private pointsService: PointsService
  ) {}

  ngOnInit(): void {
    this.question$ = this.questionService.question$;

    // Pobieramy nazwę aktualnej drużyny ze wspólnego GameService
    this.gameService.currentTeam$.subscribe((name) => {
      this.currentTeamName = name;
    });

    this.question$.subscribe((q) => {
      if (q && this.question?.id !== q.id) {
        this.question = q;
        this.resetRound();
      }
    });
  }

  private resetRound(): void {
    this.mistakes = 0;
    this.correctAnswersCount = 0;
    this.gameFinished = false;
    this.earnedPoints = 0;
    this.inputValue = '';
  }

  submitAnswer(): void {
    if (!this.question || !this.inputValue.trim() || this.gameFinished) return;

    const normalizedInput = this.normalize(this.inputValue);

    // Szukanie odpowiedzi (dokładne lub podobne - Levenshtein)
    let answerIndex = this.question.answers.findIndex(
      (a) => this.normalize(a.value) === normalizedInput
    );

    if (answerIndex === -1) {
      answerIndex = this.question.answers.findIndex((a) =>
        this.areSimilar(normalizedInput, a.value)
      );
    }

    if (answerIndex >= 0) {
      const alreadyRevealed = this.question.revealedAnswers?.includes(answerIndex) ?? false;

      if (!alreadyRevealed) {
        this.questionService.revealAnswer(answerIndex);
        this.correctAnswersCount++;

        this.correctAudio.currentTime = 0;
        this.correctAudio.play();

        if (this.question.revealedAnswers?.length === this.question.answers.length) {
          this.finishGame();
        }
        this.inputValue = '';
        return;
      }
    }

    // BŁĄD
    this.mistakes++;
    this.wrongAudio.currentTime = 0;
    this.wrongAudio.play();

    if (this.mistakes >= this.MAX_CHANCES) {
      this.finishGame();
    }
    this.inputValue = '';
  }

  finishGame(): void {
    if (this.gameFinished) return;
    this.gameFinished = true;

    if (this.question) {
      const totalAnswers = this.question.answers.length;
      const revealedCount = this.question.revealedAnswers?.length || 0;

      // Obliczamy punkty: (zgadnięte / wszystkie) * mnożnik (np. 10)
      // Jeśli zgadł 3 z 6 haseł, dostanie 5 pkt (przy mnożniku 10)
      this.earnedPoints = Math.ceil((revealedCount / totalAnswers) * this.MAX_POINTS_MULTIPLIER);

      if (this.currentTeamName && this.earnedPoints > 0) {
        // Zapis do GameService (localStorage)
        //this.gameService.updateTeamPoints(this.currentTeamName, this.earnedPoints);
        // Powiadomienie PointsService
        this.pointsService.setPoints(this.earnedPoints);
      }
    }

    this.revealAll();
  }

  private revealAll(): void {
    this.question?.answers.forEach((_, i) => {
      if (!this.question?.revealedAnswers?.includes(i)) {
        this.questionService.revealAnswer(i);
      }
    });
  }

  // --- METODY POMOCNICZE (Skopiowane z Twojego kodu) ---

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/-/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private areSimilar(input: string, answer: string): boolean {
    const normInput = this.normalize(input);
    const normAnswer = this.normalize(answer);
    if (normInput === normAnswer) return true;
    const maxEdits = normAnswer.length >= 7 ? 3 : 1;
    return this.levenshtein(normInput, normAnswer) <= maxEdits;
  }

  private levenshtein(a: string, b: string): number {
    const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    return matrix[a.length][b.length];
  }

  // Metoda sprawdzająca, czy dany indeks odpowiedzi został już odkryty
  isAnswerRevealed(index: number): boolean {
    return this.question?.revealedAnswers?.includes(index) ?? false;
  }
}
