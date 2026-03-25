import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../../shared/material';

@Component({
  selector: 'app-writing-controls',
  imports: [MATERIAL_IMPORTS],
  templateUrl: './writing-controls.component.html',
  styleUrl: './writing-controls.component.css',
})
export class WritingControlsComponent {
  @Input({ required: true }) currentTeam: any;
  @Output() answerSubmitted = new EventEmitter<string>();

  inputValue: string = '';

  submit(): void {
    if (this.inputValue.trim()) {
      this.answerSubmitted.emit(this.inputValue.trim());
      this.inputValue = ''; // Czyścimy pole po wysłaniu
    }
  }
}
