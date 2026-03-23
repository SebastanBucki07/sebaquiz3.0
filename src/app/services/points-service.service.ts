import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameService } from './game.service';
import { Hint } from '../shared/models/category/hint.interface';

@Injectable({
  providedIn: 'root',
})
export class PointsService {
  /**
   * Strumień przechowujący aktualną liczbę punktów do zdobycia w danym momencie.
   */
  private availablePointsSubject = new BehaviorSubject<number>(0);
  public availablePoints$: Observable<number> = this.availablePointsSubject.asObservable();

  /**
   * basePoints: Wartość wejściowa pytania (np. 100).
   * totalPenaltyPercent: Suma procentowa wszystkich użytych kar (np. 20 + 20 = 40%).
   */
  private basePoints = 0;
  private totalPenaltyPercent = 0;

  constructor(private gameService: GameService) {}

  // =========================
  // INICJALIZACJA I USTAWIANIE
  // =========================

  /**
   * Rozpoczyna nowe pytanie. Resetuje licznik kar i ustawia nową bazę punktową.
   */
  initQuestion(basePoints: number): void {
    this.basePoints = basePoints;
    this.totalPenaltyPercent = 0;
    this.availablePointsSubject.next(basePoints);
  }

  /**
   * Pozwala na ręczne nadpisanie punktów (np. przez bonusy).
   * Aktualizuje basePoints, aby kolejne kary za podpowiedzi były liczone od nowej wartości.
   */
  setPoints(points: number): void {
    const newPoints = Math.max(0, points);
    this.basePoints = newPoints;
    this.totalPenaltyPercent = 0; // Resetujemy kary dla "nowej bazy"
    this.availablePointsSubject.next(newPoints);
  }

  // =========================
  // LOGIKA KAR I ZMIAN
  // =========================

  /**
   * Oblicza karę na podstawie sumy procentowej, zaokrąglając wynik W GÓRĘ.
   * Dzięki Math.ceil(0.1) gracz nadal otrzyma 1 punkt zamiast 0.
   */
  applyHintPenalty(hint: Hint): void {
    this.totalPenaltyPercent += hint.penaltyPercent;
    const multiplier = Math.max(0, 1 - this.totalPenaltyPercent / 100);

    // DEBUG:
    console.log('--- PUNKTACJA ---');
    console.log('Baza:', this.basePoints);
    console.log('Suma kar %:', this.totalPenaltyPercent);
    console.log('Mnożnik:', multiplier);

    let updatedPoints = 0;
    if (multiplier > 0) {
      updatedPoints = Math.ceil(this.basePoints * multiplier);
    }

    console.log('Wynik końcowy:', updatedPoints);
    this.availablePointsSubject.next(updatedPoints);
  }

  /**
   * Ręczne odejmowanie punktów - również z zabezpieczeniem przed ujemnymi wartościami.
   */
  decreasePoints(amount: number): void {
    const current = this.availablePointsSubject.value;
    const updated = Math.max(0, current - amount);
    this.basePoints = updated;
    this.availablePointsSubject.next(updated);
  }

  // =========================
  // PRZYZNAWANIE I RESET
  // =========================

  /**
   * Wysyła aktualną (lub zdefiniowaną) liczbę punktów do GameService dla aktywnej drużyny.
   */
  awardPointsToCurrentTeam(customPoints?: number): void {
    const team = this.gameService.getCurrentTeam();
    if (!team) return;

    // Jeśli customPoints nie jest podane, weź aktualną wartość z Subjecta
    const pointsToAward = customPoints ?? this.availablePointsSubject.value;

    if (pointsToAward > 0) {
      this.gameService.updateTeamPoints(team, pointsToAward);
    }

    // Resetujemy DOPIERO PO dodaniu punktów
    this.resetPoints();
  }

  /**
   * Całkowity reset serwisu (np. po zakończeniu pytania lub gry).
   */
  resetPoints(): void {
    this.basePoints = 0;
    this.totalPenaltyPercent = 0;
    this.availablePointsSubject.next(0);
  }

  /**
   * Pobiera aktualną wartość punktów bez subskrypcji.
   */
  getAvailablePoints(): number {
    return this.availablePointsSubject.value;
  }
}
