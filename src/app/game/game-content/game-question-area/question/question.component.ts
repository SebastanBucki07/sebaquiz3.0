import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Hint} from '../../../../shared/category/category.interface';
import {MATERIAL_IMPORTS} from '../../../../shared/material';
import {CommonModule} from '@angular/common';
import {TipsComponent} from './tips/tips.component';

@Component({
  selector: 'app-question',
  imports: [
    CommonModule,
    MATERIAL_IMPORTS,
    TipsComponent
  ],
  templateUrl: './question.component.html',
  standalone: true,
  styleUrl: './question.component.css'
})
export class QuestionComponent {
  @Input() hints: Hint[] = [];
  @Output() hintUsed = new EventEmitter<Hint>();

  useHint(hint: Hint) {
    this.hintUsed.emit(hint);
  }

  onHintUsedFromTips(hint: Hint) {
    this.hintUsed.emit(hint); // przekazujemy event dalej do GameQuestionArea
  }

  ngOnInit() {
    console.log('Hints received in child:', this.hints);
  }
}
