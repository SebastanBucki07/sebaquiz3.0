import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {Category} from '../../shared/category/category.interface';
import {QuestionService} from '../../shared/question-service.service';
import {MATERIAL_IMPORTS} from '../../shared/material';

@Component({
  selector: 'app-game-content',
  templateUrl: './game-content.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterOutlet,
    MATERIAL_IMPORTS
  ],
  styleUrl: './game-content.component.css'
})
export class GameContentComponent implements OnInit{
  selectedCategories: Category[] = [];

  constructor(private router: Router,private questionService: QuestionService) {}

  ngOnInit() {
    const saved = localStorage.getItem('selectedCategories');
    this.selectedCategories = saved ? JSON.parse(saved) : [];
  }

// Zmieniamy getCategoryColor, żeby szare dla wyczerpanych kategorii
  getCategoryColor(category: Category, index: number): string {
    const remaining = this.getRemainingQuestions(category);
    if (remaining === 0) {
      return '#9e9e9e'; // szary dla wyczerpanej kategorii
    }

    // Gradient dynamiczny w zależności od indeksu
    const hue = (index * 360) / this.selectedCategories.length;
    const colorStart = `hsl(${hue}, 70%, 50%)`;
    const colorEnd = `hsl(${(hue + 30) % 360}, 70%, 60%)`;

    return `linear-gradient(45deg, ${colorStart}, ${colorEnd})`;
  }


// Liczba dostępnych pytań w danej kategorii
  getRemainingQuestions(category: Category): number {
    const allQuestions = this.questionService['getQuestions'](category.type, category.name);
    const used = this.questionService['usedQuestions'].filter(q =>
      allQuestions.some(aq => aq.id === q.id)
    );
    return allQuestions.length - used.length;
  }

// Obsługa kliknięcia
  goToCategory(category: Category) {
    const remaining = this.getRemainingQuestions(category);
    if (remaining === 0) {
      alert(`Brak pytań dla kategorii "${category.name}"`);
      return;
    }

    this.router.navigate(['game/category', category.type, category.name, category.type]);
  }



  colors: string[][] = [
    ['#3f51b5', '#2196f3'],
    ['#e91e63', '#f06292'],
    ['#009688', '#26a69a'],
    ['#ff9800', '#ffc107'],
    ['#673ab7', '#9575cd'],
    ['#4caf50', '#81c784']
  ];

  // getCategoryColor(index: number): string {
  //   const hue = (index * 360) / this.selectedCategories.length;
  //   return `hsl(${hue}, 70%, 50%)`;
  // }

  isCategoryExhausted(categoryName: string, categoryType: string): boolean {
    return !this.questionService.hasMoreQuestions(categoryType, categoryName);
  }
}
