import { Component } from '@angular/core';
import { TipsComponent } from '../question/tips/tips.component';
import { QuestionService } from '../../../../services/question-service.service';
import { CommonQuestionComponent } from '../common-question/common-question.component';

@Component({
  selector: 'app-hints-category',
  standalone: true,
  templateUrl: './hints-category.component.html',
  styleUrls: ['./hints-category.component.css'],
  imports: [TipsComponent],
})
export class HintsCategoryComponent extends CommonQuestionComponent {
  constructor(questionService: QuestionService) {
    super(questionService);
  }
}
