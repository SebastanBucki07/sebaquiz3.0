import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../../../shared/question-service.service';
import { Observable } from 'rxjs';
import { Question } from '../../../../shared/questions/question.interface';
import { CommonModule } from '@angular/common';
import { MATERIAL_IMPORTS } from '../../../../shared/material';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-one-answer-category',
  standalone: true,
  imports: [CommonModule, MATERIAL_IMPORTS, MatDivider],
  templateUrl: './one-answer-category.component.html',
  styleUrl: './one-answer-category.component.scss',
})
export class OneAnswerCategoryComponent implements OnInit {
  question$!: Observable<Question | null>;

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.question$ = this.questionService.question$;
  }
}
