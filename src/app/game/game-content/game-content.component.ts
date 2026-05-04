import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Category } from '../../shared/models/category/category.interface';
import { QuestionService } from '../../services/question-service.service';
import { MatIcon } from '@angular/material/icon';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-content',
  templateUrl: './game-content.component.html',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterOutlet, MatIcon],
  styleUrl: './game-content.component.css',
})
export class GameContentComponent implements OnInit {
  selectedCategories: Category[] = [];
  categoryState = new Map<string, number>();

  constructor(
    private router: Router,
    private questionService: QuestionService,
    private gameService: GameService
  ) {}

  async ngOnInit() {
    const saved = localStorage.getItem('selectedCategories');
    this.selectedCategories = saved ? JSON.parse(saved) : [];

    await this.preloadCategoryState();
  }

  private async preloadCategoryState() {
    for (const category of this.selectedCategories) {
      const remaining = await this.questionService.getRemainingQuestions(
        category.type,
        category.name
      );

      this.categoryState.set(`${category.type}|${category.name}`, remaining);
    }
  }

  // Number of available questions in a given category
  getRemainingQuestions(category: Category): number {
    return this.categoryState.get(`${category.type}|${category.name}`) ?? 0;
  }

  goToCategory(category: Category) {
    const remaining = this.getRemainingQuestions(category);

    if (remaining === 0) {
      alert('Wszystkie pytania w tej kategorii zostały wyświetlone!');
      return;
    }

    // Pobieramy indeks z serwisu
    const currentPlayerIndex = this.gameService.getCurrentTeamIndex();

    this.router.navigate(['game/category', category.type, category.name, category.type], {
      queryParams: { startPlayer: currentPlayerIndex },
    });
  }

  drawRandomQuestion(): void {
    const availableCategories = this.selectedCategories.filter(
      (category) => this.getRemainingQuestions(category) > 0
    );

    if (availableCategories.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableCategories.length);
    const randomCategory = availableCategories[randomIndex];

    this.goToCategory(randomCategory);
  }
}
