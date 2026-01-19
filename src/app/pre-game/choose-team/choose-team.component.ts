import {Component, OnInit, OnDestroy} from '@angular/core';
import { MATERIAL_IMPORTS } from '../../shared/material';
import { GameService } from '../../shared/game.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface Team {
  id: number;
  name: string;
  points: number;
}

@Component({
  selector: 'app-choose-team',
  standalone: true,
  imports: MATERIAL_IMPORTS,
  templateUrl: './choose-team.component.html',
  styleUrl: './choose-team.component.css'
})
export class ChooseTeamComponent implements OnInit, OnDestroy {
  teams: Team[] = [];
  newTeamName = '';
  displayedColumns: string[] = ['id', 'name', 'points', 'actions'];
  private destroy$ = new Subject<void>();

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.loadTeams();
    
    // Listen for game reset
    this.gameService.reset$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
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
    let newId = 1;
    while (this.teams.some(t => t.id === newId)) {
      newId++;
    }
    return newId;
  }

  addTeam() {
    if (this.newTeamName.trim()) {
      this.teams = [...this.teams, { id: this.getNextId(), name: this.newTeamName.trim(), points: 0 }];
      this.saveTeams();
      this.newTeamName = '';
    }
  }

  removeTeam(id: number) {
    this.teams = this.teams.filter(t => t.id !== id);
    this.saveTeams();
  }

  saveTeams() {
    localStorage.setItem('teams', JSON.stringify(this.teams));
    this.gameService.notifyDataChanged();
  }
}
