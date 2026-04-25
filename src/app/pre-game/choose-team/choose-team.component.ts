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
  displayedColumns: string[] = ['avatar', 'id', 'name', 'points', 'actions'];
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
    // Tworzymy tablicę [1, 2, 3, ..., 15]
    const allIds = Array.from({ length: 15 }, (_, i) => i + 1);

    // Filtrujemy te, które są już zajęte przez wczytane drużyny
    const usedIds = this.teams.map((t) => {
      // Wyciągamy numer z URL (np. "assets/avatars/5.png" -> 5)
      const match = t.avatarUrl.match(/(\d+)\.png$/);
      return match ? parseInt(match[1]) : null;
    });

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

    if (trimmedName.length >= 4) {
      if (this.availableAvatarIds.length === 0) {
        alert('Brak dostępnych unikalnych awatarów!');
        return;
      }

      const nextId = this.getNextId();

      // 1. Losujemy losowy indeks z puli dostępnych ID
      const randomIndex = Math.floor(Math.random() * this.availableAvatarIds.length);

      // 2. Pobieramy unikalny numer awatara
      const chosenAvatarId = this.availableAvatarIds[randomIndex];

      // 3. USUWAMY ten numer z puli, żeby nikt go więcej nie wylosował
      this.availableAvatarIds.splice(randomIndex, 1);

      const newTeam: Team = {
        id: nextId,
        name: trimmedName,
        points: 0,
        avatarUrl: `/avatars/${chosenAvatarId}.png`,
      };

      this.teams = [...this.teams, newTeam];
      this.saveTeams();
      this.newTeamName = '';
    }
  }

  removeTeam(id: number) {
    const teamToRemove = this.teams.find((t) => t.id === id);
    if (teamToRemove) {
      // Wyciągamy numer awatara i dodajemy go z powrotem do puli
      const match = teamToRemove.avatarUrl.match(/(\d+)\.png$/);
      if (match) {
        this.availableAvatarIds.push(parseInt(match[1]));
      }
    }

    this.teams = this.teams.filter((t) => t.id !== id);
    this.saveTeams();
  }

  saveTeams() {
    localStorage.setItem('teams', JSON.stringify(this.teams));
    this.gameService.notifyDataChanged();
  }
}
