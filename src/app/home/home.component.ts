import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Potrzebne dla *ngIf
import { GameService } from '../services/game.service';
import { QuestionService } from '../services/question-service.service';
import { SupabaseService } from '../services/supabase.service';
import { AuthComponent } from '../auth/auth.component'; // Dopasuj ścieżkę
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, AuthComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  showLoginPanel = false;
  private authSubscription!: Subscription;

  constructor(
    private router: Router,
    private gameService: GameService,
    private questionService: QuestionService,
    private supabase: SupabaseService
  ) {}

  async ngOnInit() {
    const user = await this.supabase.getCurrentUser();
    this.isLoggedIn = !!user;

    const {
      data: { subscription },
    } = this.supabase.authChanges();

    this.authSubscription = new Subscription(() => subscription.unsubscribe());

    this.supabase.auth.onAuthStateChange((event, session) => {
      this.isLoggedIn = !!session;
      if (this.isLoggedIn) {
        this.showLoginPanel = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  toggleLogin() {
    this.showLoginPanel = !this.showLoginPanel;
  }

  newGame() {
    this.gameService.resetGame();
    this.questionService.resetQuestions();
    const teams = JSON.parse(localStorage.getItem('teams') || '[]');
    if (teams.length > 0) {
      this.gameService.setCurrentTeam(teams[0].name);
    }
    this.router.navigate(['/pregame']);
  }

  goToConfig() {
    this.router.navigate(['/configure']);
  }
}
