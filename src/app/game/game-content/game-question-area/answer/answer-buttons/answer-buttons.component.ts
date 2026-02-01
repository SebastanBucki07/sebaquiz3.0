import {Component, Output, EventEmitter, Input} from '@angular/core';

import {CommonModule} from '@angular/common';
import {MATERIAL_IMPORTS} from '../../../../../shared/material';


@Component({
  selector: 'app-answer-buttons',
  standalone: true,
  imports: [CommonModule, MATERIAL_IMPORTS],
  templateUrl: './answer-buttons.component.html',
  styleUrl: './answer-buttons.component.css'
})
export class AnswerButtonsComponent {
  @Input() disabled = false;
  @Output() correct = new EventEmitter<void>();
  @Output() wrong = new EventEmitter<void>();
}
