import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AsyncPipe, NgIf} from '@angular/common';
import {PhotoTipsComponent} from '../question/photo-tips/photo-tips.component';
import {QuestionService} from '../../../../shared/question-service.service';
import {Observable} from 'rxjs';
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
  }

  onHintUsed(hint: Hint) {
    this.hintUsed.emit(hint);
  }

  isImage(url: string): boolean {
    if (!url) return false;
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || url.startsWith('http');
  }
}
