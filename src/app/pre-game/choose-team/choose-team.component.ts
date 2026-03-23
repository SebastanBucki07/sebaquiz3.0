import { Component, OnInit, OnDestroy } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../shared/material';
import { GameService } from '../../services/game.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Team } from '../../shared/models/teams/team.interface';

@Component({
  selector: 'app-choose-team',
  standalone: true,
  imports: [CommonModule, FormsModule, ...MATERIAL_IMPORTS],
  templateUrl: './choose-team.component.html',
  styleUrl: './choose-team.component.css',
})
export class ChooseTeamComponent implements OnInit, OnDestroy {
  teams: Team[] = [];
  newTeamName = '';
  displayedColumns: string[] = ['id', 'name', 'points', 'actions'];
  private destroy$ = new Subject<void>();

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.loadTeams();

    this.gameService.reset$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.teams = [];
      this.newTeamName = '';
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTeams() {
    const saved = localStorage.getItem('teams');
    if (saved) {
      this.teams = JSON.parse(saved);
    }
  }

  getNextId(): number {
    return this.teams.length > 0 ? Math.max(...this.teams.map((t) => t.id)) + 1 : 1;
  }

  addTeam() {
    const trimmedName = this.newTeamName.trim();

    if (trimmedName.length >= 3) {
      const newTeam: Team = {
        id: this.getNextId(),
        name: trimmedName,
        points: 0,
      };

      this.teams = [...this.teams, newTeam];
      this.saveTeams();
      this.newTeamName = '';
    }
  }

  removeTeam(id: number) {
    this.teams = this.teams.filter((t) => t.id !== id);
    this.saveTeams();
  }

  saveTeams() {
    localStorage.setItem('teams', JSON.stringify(this.teams));
    this.gameService.notifyDataChanged();
  }
}
