import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private resetSubject = new Subject<void>();
  reset$ = this.resetSubject.asObservable();

  private dataChangedSubject = new Subject<void>();
  dataChanged$ = this.dataChangedSubject.asObservable();

  private currentTeamSubject = new BehaviorSubject<string | null>(null);
  currentTeam$ = this.currentTeamSubject.asObservable();

  constructor() {}

  // =========================
  // TEAM MANAGEMENT
  // =========================

  setCurrentTeam(team: string): void {
    this.currentTeamSubject.next(team);
  }

  getCurrentTeam(): string | null {
    return this.currentTeamSubject.value;
  }

  nextTeam(): void {
    const teams = JSON.parse(localStorage.getItem('teams') || '[]');
    if (!teams.length) return;

    const currentTeam = this.currentTeamSubject.value;

    const currentIndex = teams.findIndex((t: any) => t.name === currentTeam);

    const nextIndex =
      currentIndex === -1 || currentIndex === teams.length - 1 ? 0 : currentIndex + 1;

    this.currentTeamSubject.next(teams[nextIndex].name);
  }

  // =========================
  // POINTS UPDATE (wywoływane przez PointsService)
  // =========================

  updateTeamPoints(teamName: string, points: number): void {
    const teams = JSON.parse(localStorage.getItem('teams') || '[]');
    if (!teams.length) return;

    const team = teams.find((t: any) => t.name === teamName);
    if (!team) return;

    team.points += points;

    localStorage.setItem('teams', JSON.stringify(teams));
    this.notifyDataChanged();
  }

  // =========================
  // RESET
  // =========================

  resetGame(): void {
    localStorage.removeItem('teams');
    localStorage.removeItem('selectedCategories');
    this.currentTeamSubject.next(null);
    this.resetSubject.next();
  }

  notifyDataChanged(): void {
    this.dataChangedSubject.next();
  }
}
