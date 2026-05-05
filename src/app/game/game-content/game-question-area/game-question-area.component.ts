import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuestionAreaHeaderComponent } from './question-area-header/question-area-header.component';
import { GameService } from '../../../services/game.service';
import { Category } from '../../../shared/models/category/category.interface';
import { QuestionService } from '../../../services/question-service.service';
import { AnswerComponent } from './answer/answer.component';
import { PointsService } from '../../../services/points-service.service';
import { Hint } from '../../../shared/models/category/hint.interface';
import { WritingGameCoreService } from '../../../services/writting-game-core.service';

@Component({
  selector: 'app-game-question-area',
  templateUrl: './game-question-area.component.html',
  standalone: true,
  imports: [CommonModule, QuestionAreaHeaderComponent, RouterOutlet, AnswerComponent],
  styleUrl: './game-question-area.component.css',
})
export class GameQuestionAreaComponent implements OnInit {
  currentCategory!: Category;
  usedHints: Hint[] = [];
  isTimerActive = true;
  private activeChildComponent: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    private questionService: QuestionService,
    protected pointsService: PointsService,
    private gameCore: WritingGameCoreService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const type = params.get('type');
      const name = params.get('name');

      if (!type || !name) {
        this.router.navigate(['/game']);
        return;
      }

      const savedCategories = JSON.parse(localStorage.getItem('selectedCategories') || '[]');
      const category = savedCategories.find((c: Category) => c.type === type && c.name === name);

      if (!category) {
        this.router.navigate(['/game']);
        return;
      }

      this.currentCategory = category;
      this.pointsService.setPoints(this.currentCategory.basePoints);
      this.questionService.loadRandomQuestion(type, name);
      // DODAJ TO:
      console.log('--- DEBUG KATEGORII ---');
      console.log('Obiekt kategorii:', this.currentCategory);
      console.log('Czas z bazy (timer_seconds):', this.currentCategory?.timer_seconds);
    });
  }

  // --- LOGIKA TIMERA ---

  onTimeExpired(): void {
    this.isTimerActive = false;

    // Dodajemy 'familiada' do sprawdzanych typów
    const manualTimeoutCategories = ['writting-category', 'footballGame', 'familiada'];

    if (manualTimeoutCategories.includes(this.currentCategory?.type || '')) {
      if (this.activeChildComponent?.triggerTimeoutError) {
        // Teraz Familiada sama naliczy błąd i JEDNORAZOWO policzy punkty
        this.activeChildComponent.triggerTimeoutError();
      }
    } else {
      // Inne kategorie (np. zwykły Quiz), gdzie po prostu pokazujemy odpowiedzi
      this.revealAllAnswers();
      this.gameCore.triggerWrongEffects();
    }
  }

  private revealAllAnswers(): void {
    // Pobieramy aktualne pytanie
    const question = this.questionService.getCurrentQuestion();
    if (question && question.answers) {
      question.answers.forEach((_, i) => {
        // Wywołujemy mechanizm odkrywania dla każdego indeksu
        this.questionService.revealAnswer(i);
      });
    }
  }

  private resetTimer(): void {
    this.isTimerActive = false;
    setTimeout(() => {
      this.isTimerActive = true;
    }, 50);
  }

  get currentTimerLimit(): number {
    // Jeśli kategoria z bazy ma timerSeconds, użyj go.
    // W przeciwnym razie daj domyślne 30 sekund.
    return this.currentCategory?.timer_seconds || 30;
  }

  // --- OBSŁUGA ODPOWIEDZI ---

  wrong() {
    this.usedHints = [];
    this.gameService.nextTeam();
    this.router.navigate(['/game']);
  }

  correct(): void {
    this.pointsService.awardPointsToCurrentTeam();
    this.usedHints = [];
    this.gameService.nextTeam();
    this.router.navigate(['/game']);
  }

  half(): void {
    const points = Math.ceil(this.currentPoints / 2);
    this.pointsService.awardPointsToCurrentTeam(points);
    this.usedHints = [];
    this.gameService.nextTeam();
    this.router.navigate(['/game']);
  }

  // --- INNE ---

  public onActivate(component: any): void {
    this.activeChildComponent = component;

    // Subskrypcja hintów
    if (component.hintUsed) {
      component.hintUsed.subscribe((hint: Hint) => this.onHintUsed(hint));
    }

    // Subskrypcja resetu timera (dla Writing Category)
    if (component.answerSubmitted) {
      component.answerSubmitted.subscribe(() => this.resetTimer());
    }
  }

  onHintUsed(hint: Hint): void {
    if (!this.usedHints.some((h) => h.id === hint.id)) {
      this.usedHints = [...this.usedHints, hint];
      this.pointsService.applyHintPenalty(hint);
    }
  }

  get currentPoints(): number {
    if (!this.currentCategory) return 0;
    const available = this.pointsService.getAvailablePoints();
    const effectivePoints = available > 0 ? available : this.currentCategory.basePoints;
    const totalPenaltyPercent = this.usedHints.reduce((sum, h) => sum + h.penaltyPercent, 0);
    const multiplier = Math.max(0, 1 - totalPenaltyPercent / 100);
    return Math.round(effectivePoints * multiplier);
  }
}
