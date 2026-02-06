import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AsyncPipe, NgIf} from '@angular/common';
import {PhotoTipsComponent} from '../question/photo-tips/photo-tips.component';
import {QuestionService} from '../../../../shared/question-service.service';
import {firstValueFrom, Observable} from 'rxjs';
import {Question} from '../../../../shared/questions/question.interface';
import {Hint} from '../../../../shared/category/category.interface';

@Component({
  selector: 'app-photo-hints-category',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    PhotoTipsComponent,
  ],
  templateUrl: './photo-hints-category.component.html',
  styleUrl: './photo-hints-category.component.css'
})
export class PhotoHintsCategoryComponent  implements OnInit{
  question$!: Observable<Question | null>;
  @Output() hintUsed = new EventEmitter<Hint>();

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.question$ = this.questionService.question$;

    // subskrypcja do aktualnego pytania
    this.question$.subscribe(async q => {
      if (!q) return;

      // jeśli to kategoria film z obsadą i hints są puste
      if (q.question === 'W jakim filmie zagrała taka obsada?' && (!q.hints || q.hints.length === 0)) {
        try {
          const hints = await this.questionService.fetchHintsForQuestion(q);
          q.hints = hints;

          // force refresh w BehaviorSubject, żeby template się przeładował
          this.questionService.updateCurrentQuestion(q);
        } catch (err) {
          console.error('Błąd pobierania aktorów:', err);
        }
      }
    });
  }

  onHintUsed(hint: Hint) {
    this.hintUsed.emit(hint);
  }

  isImage(url: string): boolean {
    if (!url) return false;
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || url.startsWith('http');
  }

  async loadHintsIfMovieCast() {
    const q = await firstValueFrom(this.question$);
    if (!q) return;

    // Sprawdzenie po treści pytania, możesz też użyć np. typu kategorii
    if (q.question === 'W jakim filmie zagrała taka obsada?' && (!q.hints || q.hints.length === 0)) {
      try {
        // fetchujemy hints tylko dla tego pytania
        const hints = await this.questionService.fetchHintsForQuestion(q);
        q.hints = hints; // zapisujemy do pytania
      } catch (err) {
        console.error('Błąd pobierania aktorów:', err);
      }
    }
  }
}
