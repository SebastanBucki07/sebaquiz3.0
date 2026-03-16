import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipsComponent } from './tips/tips.component';
import { Hint } from '../../../../shared/models/category/hint.interface';

@Component({
  selector: 'app-question',
  imports: [CommonModule, TipsComponent],
  templateUrl: './question.component.html',
  standalone: true,
  styleUrl: './question.component.css',
})
export class QuestionComponent {
  @Input() hints: Hint[] = [];
  @Output() hintUsed = new EventEmitter<Hint>();

  onHintUsedFromTips(hint: Hint) {
    this.hintUsed.emit(hint); // we forward the event to GameQuestionArea
  }

  ngOnInit() {
    console.log('Hints received in child:', this.hints);
  }
}
