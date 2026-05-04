import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Team } from '../../shared/models/teams/team.interface';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatError, MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-choose-team',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormField, MatLabel, MatError, MatIcon, MatInput],
  templateUrl: './choose-team.component.html',
  styleUrl: './choose-team.component.css',
})
export class ChooseTeamComponent implements OnInit, OnDestroy {
  teams: Team[] = [];
  availableAvatarIds: number[] = [];
  newTeamName = '';
  private destroy$ = new Subject<void>();

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.loadTeams();
    this.prepareAvailableAvatars();
    this.gameService.reset$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.teams = [];
      this.newTeamName = '';
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  prepareAvailableAvatars() {
    const allIds = Array.from({ length: 14 }, (_, i) => i + 1);

    const usedIds = this.teams
      .map((t) => {
        const match = t.avatarUrl.match(/(\d+)\.png$/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((id) => id !== null) as number[];

    this.availableAvatarIds = allIds.filter((id) => !usedIds.includes(id));
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
    if (trimmedName.length < 4) return;

    // Odśwież pulę przed losowaniem dla pewności
    this.prepareAvailableAvatars();

    if (this.availableAvatarIds.length === 0) {
      alert('Brak dostępnych unikalnych awatarów!');
      return;
    }

    const randomIndex = Math.floor(Math.random() * this.availableAvatarIds.length);
    const chosenAvatarId = this.availableAvatarIds[randomIndex];

    // Sprawdź czy na pewno mamy ID
    if (chosenAvatarId === undefined) {
      console.error('Błąd losowania awatara!');
      return;
    }

    const newTeam: Team = {
      id: this.getNextId(),
      name: trimmedName,
      points: 0,
      avatarUrl: `/avatars/${chosenAvatarId}.png`,
    };

    this.teams = [...this.teams, newTeam];
    this.saveTeams();
    this.prepareAvailableAvatars(); // Aktualizujemy pulę po dodaniu
    this.newTeamName = '';
  }

  removeTeam(id: number) {
    this.teams = this.teams.filter((t) => t.id !== id);
    this.saveTeams();
    this.prepareAvailableAvatars(); // Automatycznie przywróci ID usuniętego awatara do puli
  }

  saveTeams() {
    localStorage.setItem('teams', JSON.stringify(this.teams));
    this.gameService.notifyDataChanged();
  }
}
