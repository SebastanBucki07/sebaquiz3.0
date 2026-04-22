import { Component, Output, EventEmitter, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-answer-buttons',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './answer-buttons.component.html',
  styleUrl: './answer-buttons.component.css',
})
export class AnswerButtonsComponent {
  @Input() disabled = false;
  @Output() correct = new EventEmitter<void>();
  @Output() wrong = new EventEmitter<void>();
  @Output() half = new EventEmitter<void>();
}
