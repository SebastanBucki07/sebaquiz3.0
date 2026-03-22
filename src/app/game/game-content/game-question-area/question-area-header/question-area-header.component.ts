import { Component, Input, OnInit } from '@angular/core';
import { CATEGORY_LIST } from '../../../../shared/models/category/categoryList';
import { Category } from '../../../../shared/models/category/category.interface';

@Component({
  selector: 'app-question-area-header',
  templateUrl: './question-area-header.component.html',
  imports: [],
  styleUrl: './question-area-header.component.css',
})
export class QuestionAreaHeaderComponent implements OnInit {
  @Input() category!: Category;
  @Input() points!: number; // To powinno być jedyne źródło wyświetlanych punktów

  ngOnInit() {
    // Pobieramy dane kategorii z listy, jeśli trzeba
    const foundCategory = CATEGORY_LIST.find((cat) => cat.name === this.category.name);
    if (foundCategory) {
      this.category = foundCategory;
    }
  }
}
