import {Component, Input} from '@angular/core';
import {CATEGORY_LIST} from '../../../../shared/category/categoryList';
import {Category, Hint} from '../../../../shared/category/category.interface';

@Component({
  selector: 'app-question-area-header',
  templateUrl: './question-area-header.component.html',
  styleUrl: './question-area-header.component.css'
})
export class QuestionAreaHeaderComponent {
  points!: number;

  @Input() category!: Category;
  @Input() usedHints: Hint[] = [];


  ngOnInit() {
    this.category = CATEGORY_LIST.find(cat => cat.name === this.category.name)!;

    if (this.category) {
      this.points = this.category.basePoints;
    } else {
      this.points = 0;
    }
  }

  get currentPoints(): number {
    if (!this.category) return 0;
    const totalPenalty = this.usedHints.reduce((sum, h) => sum + h.penaltyPercent, 0);
    return Math.round(this.category.basePoints * Math.max(0, 1 - totalPenalty / 100));
  }
}
