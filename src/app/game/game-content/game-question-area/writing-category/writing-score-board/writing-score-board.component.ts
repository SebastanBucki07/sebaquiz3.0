import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-writing-score-board',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './writing-score-board.component.html',
  styleUrls: ['./writing-score-board.component.scss'],
})
export class WritingScoreBoardComponent {
  // Dane wejściowe z komponentu nadrzędnego
  @Input({ required: true }) teams: any[] = [];
  @Input({ required: true }) activeTeamId: string | number | null = null;
  @Input() maxChances: number = 3;
  @Input() gameFinished: boolean = false;

  /**
   * Generuje tablicę o zadanej długości, aby @for mógł po niej iterować
   * Rozwiązuje błąd "Unresolved function getArray"
   */
  getArray(length: number): number[] {
    return new Array(Math.max(0, length));
  }

  /**
   * Sprawdza, czy drużyna została wyeliminowana
   */
  isEliminated(team: any): boolean {
    return team.mistakes >= this.maxChances;
  }

  /**
   * Zwraca kolor dla specyficznych elementów (opcjonalne, jeśli używasz team.color)
   */
  getTeamColor(team: any): string {
    return team.color || '#ffffff';
  }
}
