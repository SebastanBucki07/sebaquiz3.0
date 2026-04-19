import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MATERIAL_IMPORTS } from '../../../../shared/material';
import { MatDivider } from '@angular/material/divider';
import { CommonQuestionComponent } from '../common-question/common-question.component';
import { QuestionService } from '../../../../services/question-service.service';

@Component({
  selector: 'app-one-answer-category',
  standalone: true,
  imports: [CommonModule, MATERIAL_IMPORTS, MatDivider],
  templateUrl: './one-answer-category.component.html',
  styleUrl: './one-answer-category.component.scss',
})
export class OneAnswerCategoryComponent extends CommonQuestionComponent {
  constructor(questionService: QuestionService) {
    super(questionService);
  }
}
