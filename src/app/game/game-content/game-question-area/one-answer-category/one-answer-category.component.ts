import {Component, OnInit} from '@angular/core';
import {QuestionService} from '../../../../shared/question-service.service';

@Component({
  selector: 'app-one-answer-category',
  imports: [],
  templateUrl: './one-answer-category.component.html',
  styleUrl: './one-answer-category.component.css'
})
export class OneAnswerCategoryComponent implements OnInit{
  question!: any;

  constructor(private questionService: QuestionService) {}

  ngOnInit() {
    this.questionService.question$
      .subscribe(q => this.question = q);
  }
}
