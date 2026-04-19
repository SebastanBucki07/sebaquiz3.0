import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CommonQuestionComponent} from '../common-question/common-question.component';

@Component({
  selector: 'app-multiple-choice-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multiple-choice-category.component.html',
  styleUrl: './multiple-choice-category.component.css',
})
export class MultipleChoiceCategoryComponent extends CommonQuestionComponent {

}
