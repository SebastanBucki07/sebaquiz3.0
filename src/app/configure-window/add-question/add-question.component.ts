import { Component } from '@angular/core';
import { OneAnswerFormComponent } from './one-answer-form/one-answer-form.component';
import { HintsFormComponent } from './hints-form/hints-form.component';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';

type FormType = 'one-answer' | 'hint' | null;

@Component({
  selector: 'app-add-question',
  imports: [
    OneAnswerFormComponent,
    HintsFormComponent,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatIcon,
    MatDivider,
  ],
  templateUrl: './add-question.component.html',
  styleUrl: './add-question.component.scss',
})
export class AddQuestionComponent {
  activeForm: FormType = null;

  setForm(type: FormType) {
    this.activeForm = type;
  }
}
