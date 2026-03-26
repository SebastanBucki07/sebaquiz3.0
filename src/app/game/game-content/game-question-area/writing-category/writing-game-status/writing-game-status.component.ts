import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Keep CommonModule for ngIf, ngFor etc.
import { MatCardModule } from '@angular/material/card';
import {Question} from '../../../../../shared/questions/question.interface';

@Component({
  selector: 'app-writing-game-status',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './writing-game-status.component.html',
  styleUrls: ['./writing-game-status.component.scss'],
})
export class WritingGameStatusComponent {
  @Input() question: Question | null = null;
  @Input({ required: true }) gameFinished: boolean = false;
  @Input() winner: any | null = null;
  @Input() remainingAnswers: number = 0;
}
