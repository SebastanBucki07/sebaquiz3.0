import { Component, EventEmitter, Input, Output } from '@angular/core';
import {MatCard} from '@angular/material/card';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-writing-controls',
  imports: [
    MatCard,
    MatFormField,
    FormsModule,
    MatIcon,
    MatInput,
    MatLabel,
    NgIf,
    MatButton
  ],
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
