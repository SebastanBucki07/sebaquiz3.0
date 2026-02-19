import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameService } from './game.service';
import { Hint } from './category/category.interface';

@Injectable({
  providedIn: 'root',
})
export class PointsService {
  // aktualna liczba punktów możliwa do zdobycia
  private availablePointsSubject = new BehaviorSubject<number>(0);
  availablePoints$ = this.availablePointsSubject.asObservable();

  // konfiguracja aktualnego pytania
  private basePoints = 0;
  private penaltyPerHint = 0;

  constructor(private gameService: GameService) {}

  // =========================
  // INICJALIZACJA PYTANIA
  // =========================

  initQuestion(basePoints: number, penaltyPerHint: number = 0): void {
    this.basePoints = basePoints;
    this.penaltyPerHint = penaltyPerHint;
    this.availablePointsSubject.next(basePoints);
  }

  // =========================
  // GETTERY
  // =========================

  getAvailablePoints(): number {
    return this.availablePointsSubject.value;
  }

  // =========================
  // ZMNIEJSZANIE PUNKTÓW
  // =========================

  applyHintPenalty(hint: Hint): void {
    const current = this.availablePointsSubject.value;
    const penalty = Math.round(this.basePoints * (hint.penaltyPercent / 100));
    const updated = Math.max(0, current - penalty);
    this.availablePointsSubject.next(updated);
  }

  decreasePoints(amount: number): void {
    const current = this.availablePointsSubject.value;
    const updated = Math.max(0, current - amount);
    this.availablePointsSubject.next(updated);
  }

  // =========================
  // PRZYZNAWANIE PUNKTÓW
  // =========================

  awardPointsToCurrentTeam(customPoints?: number): void {
    const team = this.gameService.getCurrentTeam();
    if (!team) return;

    const pointsToAward =
      customPoints !== undefined ? customPoints : this.availablePointsSubject.value;

    if (pointsToAward <= 0) return;

    this.gameService.updateTeamPoints(team, pointsToAward);
    this.resetPoints();
  }

  // =========================
  // RESET
  // =========================

  resetPoints(): void {
    this.availablePointsSubject.next(0);
    this.basePoints = 0;
    this.penaltyPerHint = 0;
  }

  setPoints(points: number): void {
    this.availablePointsSubject.next(Math.max(0, points));
  }
}
