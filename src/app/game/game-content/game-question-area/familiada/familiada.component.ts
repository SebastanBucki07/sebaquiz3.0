import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, tap } from 'rxjs';

import { QuestionService } from '../../../../services/question-service.service';
import { GameService } from '../../../../services/game.service';
import { PointsService } from '../../../../services/points-service.service';
import { Question } from '../../../../shared/questions/question.interface';

import { WritingControlsComponent } from '../writing-category/writting-controls/writing-controls.component';
import { WritingGameStatusComponent } from '../writing-category/writing-game-status/writing-game-status.component';
import { WritingGameCoreService } from '../../../../services/writting-game-core.service';

@Component({
  selector: 'app-familiada',
  standalone: true,
  imports: [CommonModule, WritingControlsComponent, WritingGameStatusComponent],
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
  earnedPoints = 0;
  correctHitsInRound = 0; //

  constructor(
    private questionService: QuestionService,
    private gameService: GameService,
    private pointsService: PointsService,
    public gameCore: WritingGameCoreService
  ) {}

  ngOnInit(): void {
    this.question$ = this.questionService.question$.pipe(
      tap((q) => {
        if (q && this.currentQuestion && q.id !== this.currentQuestion.id) {
          this.resetRound();
        }
        this.currentQuestion = q;
      })
    );

    this.gameService.currentTeam$.subscribe((name) => (this.currentTeamName = name));
  }

  private resetRound(): void {
    this.mistakes = 0;
    this.gameFinished = false;
    this.earnedPoints = 0;
    this.correctHitsInRound = 0; // <--- RESETUJ TUTAJ
  }

  // KLUCZOWY GETTER: Pobiera PEŁNE dane (w tym zdjęcie) z serwisu
  get currentTeamData(): any {
    const fullData = this.gameService.getFullTeamData(this.currentTeamName);
    if (!fullData) return null;

    // Mapujemy to na format, którego oczekuje WritingControls
    return {
      ...fullData,
      mistakes: this.mistakes,
      chancesLeft: this.MAX_CHANCES - this.mistakes,
    };
  }

  get winnerForStatus(): any {
    const data = this.gameService.getFullTeamData(this.currentTeamName);
    return {
      ...data,
      calculatedPoints: this.earnedPoints,
    };
  }

  submitAnswer(value: string): void {
    if (this.gameFinished || this.mistakes >= this.MAX_CHANCES || !value.trim()) return;

    const q = this.currentQuestion;
    if (!q) return;

    const allValues = q.answers.map((a) => a.value);
    const idx = this.gameCore.validateAnswer(value, allValues, q.revealedAnswers || []);

    if (idx >= 0) {
      // --- TRAFIENIE ---
      this.correctHitsInRound++; // <--- ZWIĘKSZAJ LICZNIK TRAFIEŃ
      this.gameCore.triggerCorrectEffects();
      this.questionService.revealAnswer(idx);

      const currentRevealedCount = (q.revealedAnswers?.length || 0) + 1;
      if (currentRevealedCount === q.answers.length) {
        this.finishGame();
      }
    } else {
      this.handleMistake();
    }
  }

  finishGame(): void {
    // 1. Natychmiastowa blokada, aby uniknąć podwójnego wywołania
    if (this.gameFinished) return;
    this.gameFinished = true;

    const questionSnapshot = this.currentQuestion;
    if (!questionSnapshot) return;

    // 2. Kopiujemy wartości do stałych (zamrażamy stan)
    const hits = this.correctHitsInRound;
    const currentMistakes = this.mistakes;

    console.log(`[DEBUG FAMILIADA] Trafienia: ${hits}, Błędy: ${currentMistakes}`);

    // 3. LOGIKA ZERO-TOLERANCJI
    if (hits <= 0) {
      console.log('[DEBUG FAMILIADA] Wymuszam 0 punktów - brak trafień.');
      this.earnedPoints = 0;
    } else {
      // Obliczamy punkty tylko gdy hits > 0
      this.earnedPoints = this.gameCore.calculateFinalScore(
        hits,
        questionSnapshot.answers.length,
        currentMistakes,
        this.MAX_CHANCES,
        5
      );
    }

    // 4. Zapis do serwisu
    if (this.currentTeamName) {
      console.log(`[DEBUG FAMILIADA] Wysyłam do serwisu: ${this.earnedPoints}`);
      this.pointsService.setPoints(this.earnedPoints);
    }

    // 5. Odsłaniamy resztę tablicy
    setTimeout(() => this.revealAll(), 400);
  }

  private handleMistake(): void {
    this.mistakes++;
    this.gameCore.triggerWrongEffects();

    // Sprawdzamy limit szans
    if (this.mistakes >= this.MAX_CHANCES) {
      this.finishGame();
    }
  }

  private revealAll(): void {
    this.currentQuestion?.answers.forEach((_, i) => {
      if (!this.currentQuestion?.revealedAnswers?.includes(i)) {
        this.questionService.revealAnswer(i);
      }
    });
  }
}
