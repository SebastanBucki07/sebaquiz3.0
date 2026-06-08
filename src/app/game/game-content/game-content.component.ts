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

  // Opcjonalna flaga ładowania (przydatna do pokazania np. spinnera w HTML)
  isLoading = true;

  constructor(
    private router: Router,
    private questionService: QuestionService,
    private gameService: GameService
  ) {}

  async ngOnInit() {
    const saved = localStorage.getItem('selectedCategories');
    this.selectedCategories = saved ? JSON.parse(saved) : [];

    // Odpalamy asynchroniczne ładowanie stanu
    await this.preloadCategoryState();
  }

  private async preloadCategoryState() {
    this.isLoading = true;

    try {
      // Tworzymy tablicę Promise'ów – wszystkie strzały do bazy lecą W TYM SAMYM MOMENCIE
      const promises = this.selectedCategories.map(async (category) => {
        const remaining = await this.questionService.getRemainingQuestions(
          category.type,
          category.name
        );

        // Zapisujemy od razu do Mapy, gdy dany Promise się rozwiąże
        this.categoryState.set(`${category.type}|${category.name}`, remaining);
      });

      // Czekamy, aż najwolniejsze zapytanie dobiegnie końca
      await Promise.all(promises);
    } catch (error) {
      console.error('[GameContent] Błąd podczas równoległego preloadingowania kategorii:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Liczba dostępnych pytań w danej kategorii
  getRemainingQuestions(category: Category): number {
    return this.categoryState.get(`${category.type}|${category.name}`) ?? 0;
  }

  goToCategory(category: Category) {
    const remaining = this.getRemainingQuestions(category);

    if (remaining === 0) {
      alert('Wszystkie pytania w tej kategorii zostały wyświetlone!');
      return;
    }

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
