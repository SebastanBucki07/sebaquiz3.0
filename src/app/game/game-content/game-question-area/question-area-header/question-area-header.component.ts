import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../../../shared/models/category/category.interface';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-question-area-header',
  templateUrl: './question-area-header.component.html',
  styleUrl: './question-area-header.component.css',
  standalone: true,
  imports: [CommonModule, MatIconModule],
})
export class QuestionAreaHeaderComponent {
  @Input() category!: Category;
  @Input() points!: number; // Aktualna wartość punktów za pytanie
}
