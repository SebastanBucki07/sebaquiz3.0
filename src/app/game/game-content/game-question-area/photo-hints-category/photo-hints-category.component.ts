import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { PhotoTipsComponent } from '../question/photo-tips/photo-tips.component';
import { Observable } from 'rxjs';
import { Question } from '../../../../shared/questions/question.interface';

import { FlagUrlPipe } from '../../../../shared/pipes/flag-url.pipe';
import { Hint } from '../../../../shared/models/category/hint.interface';
import { QuestionService } from '../../../../services/question-service.service';

@Component({
  selector: 'app-photo-hints-category',
  standalone: true,
  imports: [AsyncPipe, NgIf, PhotoTipsComponent, FlagUrlPipe],
  templateUrl: './photo-hints-category.component.html',
  styleUrl: './photo-hints-category.component.css',
})
export class PhotoHintsCategoryComponent implements OnInit {
  question$!: Observable<Question | null>;
  @Output() hintUsed = new EventEmitter<Hint>();

  // Te stałe mogą się przydać w templacie, jeśli chcesz wyświetlać specjalny nagłówek
  readonly MOVIE_QUESTION = 'W jakim filmie zagrała taka obsada?';
  readonly TV_QUESTION = 'W jakim serialu zagrała taka obsada?';

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    // Komponent tylko słucha strumienia.
    // Logika "jeśli to film, to pobierz aktorów" powinna być w QuestionService.
    this.question$ = this.questionService.question$;
  }

  onHintUsed(hint: Hint) {
    this.hintUsed.emit(hint);
  }

  isImage(url: string): boolean {
    if (!url) return false;
    // Sprawdzanie czy to URL obrazka
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || url.startsWith('http');
  }
}
