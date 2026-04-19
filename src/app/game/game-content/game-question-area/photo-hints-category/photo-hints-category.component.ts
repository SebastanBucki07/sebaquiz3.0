import { Component } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { PhotoTipsComponent } from '../question/photo-tips/photo-tips.component';
import { FlagUrlPipe } from '../../../../shared/pipes/flag-url.pipe';
import { QuestionService } from '../../../../services/question-service.service';
import { CommonQuestionComponent } from '../common-question/common-question.component';

@Component({
  selector: 'app-photo-hints-category',
  standalone: true,
  imports: [AsyncPipe, NgIf, PhotoTipsComponent, FlagUrlPipe],
  templateUrl: './photo-hints-category.component.html',
  styleUrl: './photo-hints-category.component.css',
})
export class PhotoHintsCategoryComponent extends CommonQuestionComponent {
  readonly MOVIE_QUESTION = 'W jakim filmie zagrała taka obsada?';
  readonly TV_QUESTION = 'W jakim serialu zagrała taka obsada?';

  constructor(questionService: QuestionService) {
    super(questionService);
  }

  isImage(url: string): boolean {
    if (!url) return false;
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || url.startsWith('http');
  }
}
