import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {Category} from '../../shared/category/category.interface';
import {QuestionService} from '../../shared/question-service.service';

@Component({
  selector: 'app-game-content',
  templateUrl: './game-content.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterOutlet
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
      return '#9e9e9e'; // szary kolor dla wyczerpanej kategorii
    }
    const hue = (index * 360) / this.selectedCategories.length;
    return `hsl(${hue}, 70%, 50%)`;
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



  colors = [
    '#3f51b5', '#e91e63', '#009688',
    '#ff9800', '#673ab7', '#4caf50'
  ];

  // getCategoryColor(index: number): string {
  //   const hue = (index * 360) / this.selectedCategories.length;
  //   return `hsl(${hue}, 70%, 50%)`;
  // }

  isCategoryExhausted(categoryName: string, categoryType: string): boolean {
    return !this.questionService.hasMoreQuestions(categoryType, categoryName);
  }
}
