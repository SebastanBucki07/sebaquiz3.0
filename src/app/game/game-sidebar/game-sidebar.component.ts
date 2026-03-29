import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { GameService } from '../../services/game.service';
import { Subject, interval, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Team } from '../../shared/models/teams/team.interface';
import { MATERIAL_IMPORTS } from '../../shared/material';

@Component({
  selector: 'app-game-sidebar',
  imports: [CommonModule, MatTableModule, MATERIAL_IMPORTS],
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

  get currentTeamName$(): Observable<string | null> {
    return this.gameService.currentTeam$;
  }

  get sortedTeams(): Team[] {
    return [...this.teams].sort((a, b) => b.points - a.points);
  }
}
