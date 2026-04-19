import { Component } from '@angular/core';
import { QuestionService } from '../../../../services/question-service.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { TipsComponent } from '../question/tips/tips.component';
import { CommonQuestionComponent } from '../common-question/common-question.component';

@Component({
  selector: 'app-photos-category',
  imports: [NgIf, AsyncPipe, TipsComponent],
  templateUrl: './photos-category.component.html',
  styleUrl: './photos-category.component.css',
})
export class PhotosCategoryComponent extends CommonQuestionComponent {
  constructor(questionService: QuestionService) {
    super(questionService);
  }
}
