import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Team {
  id: number;
  name: string;
  points: number;
}

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private teamsSubject = new BehaviorSubject<Team[]>([]);
  teams$ = this.teamsSubject.asObservable();

  constructor() {
    this.loadTeams();
  }

  private loadTeams(): void {
    const storedTeams = localStorage.getItem('teams');

    if (storedTeams) {
      const teams = JSON.parse(storedTeams) as Team[];

      this.teamsSubject.next(teams.sort((a, b) => b.points - a.points));
    }
  }
}
