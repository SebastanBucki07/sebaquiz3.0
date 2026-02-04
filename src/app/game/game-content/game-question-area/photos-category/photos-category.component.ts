import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {QuestionService} from '../../../../shared/question-service.service';
import {Question} from '../../../../shared/questions/question.interface';
import {AsyncPipe,NgIf} from '@angular/common';
import {TipsComponent} from '../question/tips/tips.component';
import {Hint} from '../../../../shared/category/category.interface';

@Component({
  selector: 'app-photos-category',
  imports: [
    NgIf,
    AsyncPipe,
    TipsComponent
  ],
  templateUrl: './photos-category.component.html',
  styleUrl: './photos-category.component.css'
})
export class PhotosCategoryComponent implements OnInit{
  question$!: Observable<Question | null>;
  @Output() hintUsed = new EventEmitter<Hint>();
  hints: Hint[] = [];
  private sub?: Subscription;

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.question$ = this.questionService.question$;
    // subscribe actual question
    this.sub = this.questionService.question$.subscribe(q => {
      this.hints = q?.hints ?? [];
    });
  }

  onHintUsed(hint: Hint): void {
    console.log('FORWARDING HINT', hint);
    this.hintUsed.emit(hint);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
