import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {normalizeText, areSimilar} from '../shared/utils/text-logic';
import {playSound} from '../shared/utils/audio-helper';

@Injectable({providedIn: 'root'})
export class WritingGameCoreService {
  private wrongFlashSubject = new BehaviorSubject<boolean>(false);
  wrongFlash$ = this.wrongFlashSubject.asObservable();

  validateAnswer(input: string, possibleAnswers: string[], revealedIndexes: number[]): number {
    const normalizedInput = normalizeText(input);

    return possibleAnswers.findIndex((ans, index) => {
      const isMatch = normalizeText(ans) === normalizedInput || areSimilar(normalizedInput, ans);
      const isAlreadyRevealed = revealedIndexes.includes(index);
      return isMatch && !isAlreadyRevealed;
    });
  }

  getNextActiveIndex(currentIndex: number, teams: any[], maxChances: number): number {
    let nextIndex = currentIndex;
    const totalTeams = teams.length;
    let attempts = 0;

    do {
      nextIndex = (nextIndex + 1) % totalTeams;
      attempts++;
    } while (teams[nextIndex].mistakes >= maxChances && attempts < totalTeams);

    return nextIndex;
  }

  triggerWrongEffects() {
    playSound('1z10zle');
    this.wrongFlashSubject.next(true);
    setTimeout(() => this.wrongFlashSubject.next(false), 400);
  }

  triggerCorrectEffects() {
    playSound('1z10dobrzee');
  }

  calculateFinalScore(
    correctAnswers: any,
    totalAnswers: number,
    mistakes: number,
    maxChances: number,
    maxBasePoints: number = 10
  ): number {
    // Wymuszamy konwersję na liczbę i sprawdzamy typ
    const hits = Number(correctAnswers);

    console.log(`[DEBUG PUNKTY] Trafienia: ${hits}, Błędy: ${mistakes}/${maxChances}`);

    // 1. ABSOLUTNA BLOKADA: Jeśli nie ma trafień, nie liczysz nic dalej.
    if (!hits || hits <= 0) {
      return 0;
    }

    // 2. Punkty za odgadnięte hasła
    const completionRate = hits / totalAnswers;
    const basePoints = completionRate * maxBasePoints;

    // 3. Bonus za życie - dodawany TYLKO jeśli gracz wygrał rundę (nie stracił wszystkich szans)
    let survivalBonus = 0;
    if (mistakes < maxChances) {
      survivalBonus = maxChances - mistakes;
    }

    const final = Math.ceil(basePoints + survivalBonus);
    return final;
  }
}
