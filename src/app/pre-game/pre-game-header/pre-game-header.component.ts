import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatCardActions } from '@angular/material/card';
import { GameService } from '../../shared/game.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-pre-game-header',
  standalone: true,
  templateUrl: './pre-game-header.component.html',
  styleUrl: './pre-game-header.component.css',
  imports: [MatButtonModule, MatDividerModule, MatIconModule, MatCardActions],
})
export class PreGameHeaderComponent implements OnInit, OnDestroy {
  teamsCount = 0;
  categoriesCount = 0;
  canStartGame = false;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private gameService: GameService
  ) {}

  ngOnInit() {
    this.checkGameReady();

    // Listen for data changes
    this.gameService.dataChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.checkGameReady());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkGameReady() {
    const teams = localStorage.getItem('teams');
    const categories = localStorage.getItem('selectedCategories');

    this.teamsCount = teams ? JSON.parse(teams).length : 0;
    this.categoriesCount = categories ? JSON.parse(categories).length : 0;

    this.canStartGame = this.teamsCount >= 2 && this.categoriesCount >= 1;
  }

  goToTeam() {
    this.router.navigate(['choose-team'], {
      relativeTo: this.router.routerState.root.firstChild?.firstChild,
    });
  }

  goToCategory() {
    this.router.navigate(['choose-category'], {
      relativeTo: this.router.routerState.root.firstChild?.firstChild,
    });
  }

  startGame() {
    if (this.canStartGame) {
      const teams = JSON.parse(localStorage.getItem('teams') || '[]');

      if (teams.length > 0) {
        this.gameService.setCurrentTeam(teams[0].name);
      }
      this.router.navigate(['/game']);
    }
  }
}
