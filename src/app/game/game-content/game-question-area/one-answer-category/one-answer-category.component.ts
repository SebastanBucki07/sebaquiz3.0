import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { CommonQuestionComponent } from '../common-question/common-question.component';
import { QuestionService } from '../../../../services/question-service.service';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatList, MatListItem} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-one-answer-category',
  standalone: true,
  imports: [CommonModule, MatDivider, MatCard, MatCardHeader, MatCardContent, MatList, MatListItem, MatIcon],
  templateUrl: './one-answer-category.component.html',
  styleUrl: './one-answer-category.component.scss',
})
export class OneAnswerCategoryComponent extends CommonQuestionComponent {
  constructor(questionService: QuestionService) {
    super(questionService);
  }
}
