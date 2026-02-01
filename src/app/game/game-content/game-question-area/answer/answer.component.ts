import {Component, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import {QuestionService} from '../../../../shared/question-service.service';
import {Observable} from 'rxjs';
import {Question} from '../../../../shared/questions/question.interface';

@Component({
  selector: 'app-answer',
  standalone: true,
  imports: [
    AsyncPipe, CommonModule
  ],
  templateUrl: './answer.component.html',
  styleUrl: './answer.component.css'
})
export class AnswerComponent implements OnInit {

  question$!: Observable<Question | null>;

  constructor(private questionService: QuestionService) {
  }

  ngOnInit() {
    this.question$ = this.questionService.question$;
  }
}
