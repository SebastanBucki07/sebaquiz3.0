import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../../../shared/models/category/category.interface';
import { MatIconModule } from '@angular/material/icon';
import { GameTimerComponent } from '../../game-timer/game-timer.component';

@Component({
  selector: 'app-question-area-header',
  templateUrl: './question-area-header.component.html',
  styleUrl: './question-area-header.component.css',
  standalone: true,
  imports: [CommonModule, MatIconModule, GameTimerComponent],
})
export class QuestionAreaHeaderComponent {
  @Input() category!: Category;
  @Input() points!: number;
  @Input() isTimerActive = true; // Pozwól rodzicowi sterować timerem
  @Input() currentCategory: any; // Upewnij się, że masz ten input
  @Input() startSeconds: number = 30; // Dodajemy ten Input

  @Output() timeExpired = new EventEmitter<void>(); // Nowy kanał komunikacji

  onTimeExpired() {
    this.timeExpired.emit(); // Podajemy dalej informację o końcu czasu
  }
}
