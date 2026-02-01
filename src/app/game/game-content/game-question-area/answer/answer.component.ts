import {Component, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import {QuestionService} from '../../../../shared/question-service.service';
import {Observable} from 'rxjs';
import {Question} from '../../../../shared/questions/question.interface';
import {MATERIAL_IMPORTS} from '../../../../shared/material';

@Component({
  selector: 'app-answer',
  standalone: true,
  imports: [
    AsyncPipe, CommonModule, MATERIAL_IMPORTS
  ],
  templateUrl: './answer.component.html',
  styleUrl: './answer.component.css'
})
export class AnswerComponent implements OnInit {

  question$!: Observable<Question | null>;

  constructor(public questionService: QuestionService) {
  }

  ngOnInit() {
    this.question$ = this.questionService.question$;
  }

  revealAnswer(index: number) {
    this.questionService.revealAnswer(index);
  }

}
