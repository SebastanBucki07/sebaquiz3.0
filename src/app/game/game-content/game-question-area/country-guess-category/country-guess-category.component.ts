import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

// Dostosuj te ścieżki do swojego projektu
import { QuestionService } from '../../../../services/question-service.service';
import { Question } from '../../../../shared/questions/question.interface';
import { Hint } from '../../../../shared/models/category/hint.interface';

@Component({
  selector: 'app-country-guess-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './country-guess-category.component.html',
  styleUrl: './country-guess-category.component.css',
})
export class CountryGuessCategoryComponent implements OnInit, OnDestroy {
  /** Emituje użycie podpowiedzi (np. dla stolicy, aby obniżyć punkty) */
  @Output() hintUsed = new EventEmitter<Hint>();

  /** Observable z aktualnym pytaniem */
  public question$!: Observable<Question | null>;

  /** Lista wszystkich podpowiedzi (area, population, borders, region, capital) */
  public hints: Hint[] = [];

  /** Zbiór ID podpowiedzi, które mają być odkryte (widoczne) */
  public openedHintIds: Set<string> = new Set<string>();

  private sub?: Subscription;
  private revealSub?: Subscription;

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.question$ = this.questionService.question$;

    // 1. Reagowanie na nowe pytanie
    this.sub = this.questionService.question$
      .pipe(
        map((q) => q?.id),
        distinctUntilChanged()
      )
      .subscribe(() => {
        const currentQuestion = this.questionService.getCurrentQuestion();

        if (currentQuestion) {
          this.hints = currentQuestion.hints ?? [];
          this.openedHintIds.clear();

          // AUTOMATYCZNE ODKRYWANIE:
          // Odkrywamy wszystko oprócz stolicy na starcie
          this.hints.forEach((hint) => {
            if (hint.label !== 'Stolica') {
              this.openedHintIds.add(hint.id);
            }
          });
        }
      });

    // 2. Odkryj wszystko (w tym stolicę), jeśli gracz podał poprawną odpowiedź
    this.revealSub = this.questionService.question$
      .pipe(
        map((q) => q?.revealedAnswers?.length ?? 0),
        distinctUntilChanged()
      )
      .subscribe((count) => {
        if (count > 0) {
          this.revealAll();
        }
      });
  }

  /**
   * Metoda dla przycisku "Pokaż stolicę"
   */
  public showCapital(hint: Hint): void {
    if (this.openedHintIds.has(hint.id)) return;

    this.openedHintIds.add(hint.id);
    this.hintUsed.emit(hint); // Wysyłamy info o karze (-90% lub ustawienie na 1 pkt)
  }

  /**
   * Zwraca odpowiednią klasę ikony dla danego labela
   */
  public getIconClass(label: string): string {
    switch (label) {
      case 'Powierzchnia':
        return 'icon-area';
      case 'Populacja':
        return 'icon-people';
      case 'Granice':
        return 'icon-borders';
      case 'Region':
        return 'icon-globe';
      default:
        return 'icon-default';
    }
  }

  /**
   * Odkrywa absolutnie wszystkie kafelki
   */
  private revealAll(): void {
    this.hints.forEach((hint) => {
      this.openedHintIds.add(hint.id);
    });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
    if (this.revealSub) this.revealSub.unsubscribe();
  }
}
