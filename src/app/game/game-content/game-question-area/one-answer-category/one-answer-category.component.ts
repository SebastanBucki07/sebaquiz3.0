import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../../../shared/question-service.service';
import { Observable } from 'rxjs';
import { Question } from '../../../../shared/questions/question.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-one-answer-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './one-answer-category.component.html',
  styleUrl: './one-answer-category.component.css',
})
export class OneAnswerCategoryComponent implements OnInit {
  question$!: Observable<Question | null>;

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.question$ = this.questionService.question$;
  }
}
