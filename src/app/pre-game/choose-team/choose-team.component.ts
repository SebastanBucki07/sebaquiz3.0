import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormsModule, NgForm, NgModel } from '@angular/forms';
import { Team } from '../../shared/models/teams/team.interface';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatError, MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { ErrorStateMatcher } from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class ImmediateErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: AbstractControl | null, form: NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched || (form && form.submitted)));
  }
}

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
  matcher = new ImmediateErrorStateMatcher();
  isAdding = false;
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

  validateNewTeamName(control: NgModel) {
    if (!control || !control.control) return;

    const errors = control.control.errors || {};
    const value = this.newTeamName || '';
    const trimmedName = value.trim();

    // Clear all our dynamic errors before re-validating
    delete errors['duplicate'];
    delete errors['whitespace'];
    delete errors['maxlength'];
    delete errors['maxTeams'];

    // Re-validate all conditions
    if (this.teams.length >= 10) {
      errors['maxTeams'] = true;
    }

    const isDuplicate = trimmedName && this.teams.some((team) => team.name.toLowerCase() === trimmedName.toLowerCase());
    if (isDuplicate) errors['duplicate'] = true;

    const isWhitespace = value && trimmedName.length === 0;
    if (isWhitespace) errors['whitespace'] = true;

    const isTooLong = value.length > 20;
    if (isTooLong) errors['maxlength'] = { requiredLength: 20, actualLength: value.length };

    control.control.setErrors(Object.keys(errors).length > 0 ? errors : null);
  }

  addTeam(teamInput: NgModel) {
    if (this.isAdding) {
      return;
    }

    teamInput.control.markAsTouched();
    this.validateNewTeamName(teamInput);

    if (teamInput.invalid) {
      return;
    }

    this.isAdding = true;

    const trimmedName = this.newTeamName.trim();
    this.prepareAvailableAvatars();

    if (this.availableAvatarIds.length === 0) {
      alert('Brak dostępnych unikalnych awatarów!');
      this.isAdding = false;
      return;
    }

    const randomIndex = Math.floor(Math.random() * this.availableAvatarIds.length);
    const chosenAvatarId = this.availableAvatarIds[randomIndex];

    if (chosenAvatarId === undefined) {
      console.error('Błąd losowania awatara!');
      this.isAdding = false;
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
    this.prepareAvailableAvatars();

    this.newTeamName = '';
    teamInput.control.setErrors(null);
    teamInput.control.markAsPristine();
    teamInput.control.markAsUntouched();

    setTimeout(() => {
      this.isAdding = false;
    }, 0);
  }

  removeTeam(id: number) {
    this.teams = this.teams.filter((t) => t.id !== id);
    this.saveTeams();
    this.prepareAvailableAvatars();
  }

  saveTeams() {
    localStorage.setItem('teams', JSON.stringify(this.teams));
    this.gameService.notifyDataChanged();
  }
}
