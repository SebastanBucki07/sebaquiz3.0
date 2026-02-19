import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { GameActualTeamComponent } from './game-actual-team/game-actual-team.component';
import { GameService } from '../../shared/game.service';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Team {
  id: number;
  name: string;
  points: number;
}

@Component({
  selector: 'app-game-sidebar',
  imports: [CommonModule, MatTableModule, GameActualTeamComponent],
  templateUrl: './game-sidebar.component.html',
  styleUrl: './game-sidebar.component.css',
})
export class GameSidebarComponent implements OnInit, OnDestroy {
  teams: Team[] = [];
  displayedColumns: string[] = ['name', 'points'];
  private destroy$ = new Subject<void>();

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.loadTeams();

    // Refresh when data changes (e.g., points)
    this.gameService.dataChanged$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadTeams();
    });

    // Refresh every 1 second to always display latest data
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadTeams();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTeams(): void {
    const storedTeams = localStorage.getItem('teams');
    if (storedTeams) {
      const teams = JSON.parse(storedTeams) as Team[];
      // Sort descending by points
      this.teams = teams.sort((a, b) => b.points - a.points);
    }
  }
}
