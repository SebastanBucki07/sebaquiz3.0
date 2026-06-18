import { Component } from '@angular/core';
import { CommonQuestionComponent } from '../common-question/common-question.component';
import { QuestionService } from '../../../../services/question-service.service';
import { CdkDragDrop, CdkDropList, moveItemInArray, CdkDrag } from '@angular/cdk/drag-drop';
import { MatDivider } from '@angular/material/divider';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe, NgIf, NgForOf, NgClass } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-chronology',
  standalone: true,
  imports: [
    MatIcon,
    MatDivider,
    MatCardContent,
    CdkDropList,
    CdkDrag,
    NgIf,
    NgForOf,
    MatCard,
    AsyncPipe,
    MatCardHeader,
    MatButton,
    NgClass,
  ],
  templateUrl: './chronology.component.html',
  styleUrl: './chronology.component.css',
})
export class ChronologySortCategoryComponent extends CommonQuestionComponent {
  isSubmitted = false;

  constructor(questionService: QuestionService) {
    super(questionService);
  }

  drop(event: CdkDragDrop<any[]>, answersList: any[]) {
    // Blokujemy możliwość przeciągania po zatwierdzeniu
    if (this.isSubmitted) return;

    if (answersList) {
      moveItemInArray(answersList, event.previousIndex, event.currentIndex);
    }
  }

  /**
   * Sprawdza ułożenie każdego elementu z osobna i aktywuje widok podsumowania
   */
  checkChronologyOrder(currentAnswers: any[], correctOrderNames: any[]) {
    if (!currentAnswers || !correctOrderNames || this.isSubmitted) return;

    this.isSubmitted = true;

    // Dajemy sygnał do AnswerComponent, by odpalił przyciski przyznawania punktów
    this.questionService.revealAnswer(0);

    const userOrder = currentAnswers.map((a) => a.value);
    const isCorrect = userOrder.every((val, index) => val === correctOrderNames[index]);

    if (isCorrect) {
      console.log('[CHRONOLOGIA] Pełen sukces, wszystko idealnie ułożone!');
    } else {
      console.log('[CHRONOLOGIA] Wykryto błędy w szeregowaniu.');
    }
  }

  /**
   * Dynamicznie przyznaje neonowe klasy per kafelek w zależności od trafienia w indeks bazy
   */
  getItemClass(item: any, currentIndex: number, correctOrderNames: any[]): string {
    if (!this.isSubmitted) return '';

    // Jeśli wydarzenie na tym indeksie zgadza się ze ściągą - zielony neon, jak nie - czerwony
    return item.value === correctOrderNames[currentIndex] ? 'item-correct' : 'item-wrong';
  }

  /**
   * Formatowanie roku/daty dla klocka (obsługuje ujemne lata p.n.e.)
   */
  getFormattedDate(item: any): string {
    if (!item || item.year === undefined) return '';
    return item.year < 0 ? `${Math.abs(item.year)} p.n.e.` : item.year.toString();
  }
}
