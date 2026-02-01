import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import {QuestionService} from '../../../../shared/question-service.service';
import {Observable} from 'rxjs';
import {Question} from '../../../../shared/questions/question.interface';
import {AnswerButtonsComponent} from './answer-buttons/answer-buttons.component';

@Component({
  selector: 'app-answer',
  standalone: true,
  imports: [
    AsyncPipe,
    CommonModule,
    AnswerButtonsComponent,
  ],
  templateUrl: './answer.component.html',
  styleUrl: './answer.component.css'
})
export class AnswerComponent implements OnInit {

  @Output() correct = new EventEmitter<void>();
  @Output() wrong = new EventEmitter<void>();

  question$!: Observable<Question | null>;

  constructor(private questionService: QuestionService) {}

  ngOnInit() {
    this.question$ = this.questionService.question$;
  }

  revealAnswer(index: number) {
    this.questionService.revealAnswer(index);
  }
}
