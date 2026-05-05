import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, tap } from 'rxjs';

// Services
import { QuestionService } from '../../../../services/question-service.service';
import { GameService } from '../../../../services/game.service';
import { PointsService } from '../../../../services/points-service.service';
import { WritingGameCoreService } from '../../../../services/writting-game-core.service';

// Models
import { Question } from '../../../../shared/questions/question.interface';

// Components
import { WritingControlsComponent } from '../writing-category/writting-controls/writing-controls.component';
import { WritingGameStatusComponent } from '../writing-category/writing-game-status/writing-game-status.component';

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

  @Output() answerSubmitted = new EventEmitter<void>();

  question$!: Observable<Question | null>;
  currentQuestion: Question | null = null;

  currentTeamName: string | null = null;
  mistakes = 0;
  gameFinished = false;
  earnedPoints = 0;
  correctHitsInRound = 0;

  public isInputDisabled = false;

  constructor(
    private questionService: QuestionService,
    private gameService: GameService,
    private pointsService: PointsService,
    public gameCore: WritingGameCoreService
  ) {}

  ngOnInit(): void {
    this.question$ = this.questionService.question$.pipe(
      tap((q: any) => {
        if (q) {
          // 1. Naprawa struktury odpowiedzi
          if (typeof q.answers === 'string') {
            try {
              q.answers = JSON.parse(q.answers);
            } catch (e) {
              q.answers = [];
            }
          }

          // 2. Mapowanie revealed_answers
          const rawRevealed = q.revealed_answers || q.revealedAnswers;
          if (typeof rawRevealed === 'string') {
            try {
              q.revealedAnswers = JSON.parse(rawRevealed);
            } catch {
              q.revealedAnswers = [];
            }
          } else {
            q.revealedAnswers = rawRevealed || [];
          }

          // 3. Reset przy nowym pytaniu
          if (this.currentQuestion && q.id !== this.currentQuestion.id) {
            this.resetRound();
          }
          this.currentQuestion = q;
        }
      })
    );

    this.gameService.currentTeam$.subscribe((name) => (this.currentTeamName = name));
  }

  private resetRound(): void {
    this.mistakes = 0;
    this.gameFinished = false;
    this.earnedPoints = 0;
    this.correctHitsInRound = 0;
    this.isInputDisabled = false;
  }

  /**
   * Wywoływane przez rodzica po upływie czasu.
   * GWARANTUJE, że punkty zostaną policzone przed odsłonięciem wszystkiego.
   */
  public triggerTimeoutError(): void {
    if (this.gameFinished) return;

    console.log('[FAMILIADA] Czas minął. Naliczam błąd...');
    this.isInputDisabled = true;

    // Traktujemy timeout jako błąd. handleMistake samo wywoła finishGame() jeśli to był 3 błąd.
    this.handleMistake();

    // Jeśli gra jeszcze trwa, resetujemy timer dla nowej próby
    if (!this.gameFinished) {
      this.answerSubmitted.emit();
      setTimeout(() => {
        this.isInputDisabled = false;
      }, 1000);
    }
  }

  submitAnswer(value: string): void {
    if (this.gameFinished || this.isInputDisabled || !value.trim()) return;

    const q = this.currentQuestion;
    if (!q) return;

    const allValues = q.answers.map((a) => a.value);
    const idx = this.gameCore.validateAnswer(value, allValues, q.revealedAnswers || []);

    if (idx >= 0) {
      // --- TRAFIENIE ---
      this.correctHitsInRound++;
      this.gameCore.triggerCorrectEffects();
      this.questionService.revealAnswer(idx);

      this.answerSubmitted.emit(); // Reset timera

      const currentRevealedCount = (q.revealedAnswers?.length || 0) + 1;
      if (currentRevealedCount === q.answers.length) {
        this.finishGame();
      }
    } else {
      // --- BŁĄD RĘCZNY ---
      this.handleMistake();
      this.answerSubmitted.emit(); // Reset timera dla nowej próby
    }
  }

  private handleMistake(): void {
    this.mistakes++;
    this.gameCore.triggerWrongEffects();

    if (this.mistakes >= this.MAX_CHANCES) {
      this.finishGame();
    }
  }

  finishGame(): void {
    if (this.gameFinished) return;
    this.gameFinished = true;
    this.isInputDisabled = true;

    // 1. USTALAMY PUNKTY NA SZTYWNO (Tylko za to, co zgadliśmy do tej pory)
    const hits = this.correctHitsInRound;
    this.earnedPoints =
      hits > 0
        ? this.gameCore.calculateFinalScore(
            hits,
            this.currentQuestion!.answers.length,
            this.mistakes,
            3,
            5
          )
        : 0;

    // 2. PRZEKAZUJEMY FINALNĄ WARTOŚĆ (Nadpisujemy ewentualne błędy)
    this.pointsService.setPoints(this.earnedPoints);

    // 3. ODSŁANIAMY RESZTĘ
    // Po setPoints(earnedPoints), żadne revealAnswer nie powinno już zmienić wyniku w serwisie!
    this.revealAll();
  }

  private revealAll(): void {
    this.currentQuestion?.answers.forEach((_, i) => {
      if (!this.currentQuestion?.revealedAnswers?.includes(i)) {
        this.questionService.revealAnswer(i);
      }
    });
  }

  get currentTeamData(): any {
    const fullData = this.gameService.getFullTeamData(this.currentTeamName);
    if (!fullData) return null;
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
}
