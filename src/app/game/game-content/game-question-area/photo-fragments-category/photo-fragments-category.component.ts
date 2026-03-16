import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { QuestionService } from '../../../../shared/question-service.service';
import { Question } from '../../../../shared/questions/question.interface';
import { TipsComponent } from '../question/tips/tips.component';
import { Hint } from '../../../../shared/models/category/hint.interface';

@Component({
  selector: 'app-photo-fragments-category',
  standalone: true,
  imports: [CommonModule, TipsComponent],
  templateUrl: './photo-fragments-category.component.html',
  styleUrl: './photo-fragments-category.component.css',
})
export class PhotoFragmentsCategoryComponent implements OnInit, OnDestroy {
  @Output() hintUsed = new EventEmitter<Hint>();

  question$!: Observable<Question | null>;
  hints: Hint[] = [];
  tiles: boolean[] = [];

  private sub?: Subscription;
  private revealSub?: Subscription;
  private hintStep = 0; // Licznik użytych podpowiedzi

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.question$ = this.questionService.question$;

    // Inicjalizacja siatki 10x10 (100 kafelków)
    this.resetGrid();

    // 1. Subskrypcja zmian pytania (logika resetowania przy nowym ID)
    this.sub = this.questionService.question$
      .pipe(
        map((q) => q?.id),
        distinctUntilChanged()
      )
      .subscribe(() => {
        const q = this.questionService.getCurrentQuestion();
        if (!q) return;

        this.hints = q.hints ?? [];
        this.resetGrid();
        this.hintStep = 0;
      });

    // 2. Subskrypcja stanu odpowiedzi (odsłoń wszystko, jeśli poprawna odpowiedź padła)
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

  onHintUsed(hint: Hint): void {
    this.hintUsed.emit(hint);
    this.hintStep++;

    // Zakładamy, że w content hinta jest liczba kafelków do odkrycia (np. "10")
    const tilesToReveal = Number(hint.content);

    if (!isNaN(tilesToReveal) && tilesToReveal > 0) {
      this.revealRandom(tilesToReveal);
    }
  }

  private revealRandom(count: number): void {
    // 1. Znajdź wszystkie ukryte indeksy
    const hiddenIndexes = this.tiles.map((val, i) => (!val ? i : -1)).filter((i) => i !== -1);

    // 2. Odfiltruj indeksy brzegowe (jeśli jest ich wystarczająco dużo do wyboru)
    const innerIndexes = hiddenIndexes.filter((index) => {
      const isTop = index < 10;
      const isBottom = index >= 90;
      const isLeft = index % 10 === 0;
      const isRight = index % 10 === 9;
      return !isTop && !isBottom && !isLeft && !isRight;
    });

    // 3. Wybierz listę, z której będziemy losować
    // Jeśli na środku nic już nie zostało, losuj z pozostałych (brzegów)
    let pool = innerIndexes.length > 0 ? innerIndexes : hiddenIndexes;

    for (let i = 0; i < count && pool.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      const tileIndex = pool[randomIndex];

      this.tiles[tileIndex] = true;

      // Usuwamy z puli, żeby nie wylosować tego samego dwa razy w jednej pętli
      pool.splice(randomIndex, 1);

      // Jeśli w trakcie pętli pula środkowa się wyczerpie, przełącz na brzegi
      if (pool.length === 0 && innerIndexes.length > 0) {
        pool = this.tiles.map((val, i) => (!val ? i : -1)).filter((i) => i !== -1);
      }
    }
  }

  private resetGrid(): void {
    // Zawsze 100 kafelków dla siatki 10x10 zdefiniowanej w CSS
    this.tiles = Array(100).fill(false);
  }

  private revealAll(): void {
    this.tiles = this.tiles.map(() => true);
  }

  getImageSrc(question: Question): string {
    if (!question?.question) return '';
    return question.question.startsWith('http') ? question.question : '/' + question.question;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.revealSub?.unsubscribe();
  }
}
