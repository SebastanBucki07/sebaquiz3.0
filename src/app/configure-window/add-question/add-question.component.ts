import { Component } from '@angular/core';
import { OneAnswerFormComponent } from './one-answer-form/one-answer-form.component';
import { HintsFormComponent } from './hints-form/hints-form.component';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MusicQuestionFormComponent } from './music-question-form/music-question-form.component';
import { FamiliadaFormComponent } from './familiada-form/familiada-form.component';
import { FootballFormComponent } from './football-form/football-form.component';
import { WrittingFormComponent } from './writting-form/writting-form.component';

type FormType = 'one-answer' | 'hint' | 'music' | 'familiada' | 'football' | 'writting' | null;

@Component({
  selector: 'app-add-question',
  imports: [
    OneAnswerFormComponent,
    HintsFormComponent,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatIcon,
    MatDivider,
    MusicQuestionFormComponent,
    FamiliadaFormComponent,
    FootballFormComponent,
    WrittingFormComponent,
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
