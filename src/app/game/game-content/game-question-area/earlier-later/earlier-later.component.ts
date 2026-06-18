import { Component, EventEmitter, Output } from '@angular/core';
import { CommonQuestionComponent } from '../common-question/common-question.component';
import { QuestionService } from '../../../../services/question-service.service';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { AnswerButtonsComponent } from '../answer/answer-buttons/answer-buttons.component';

@Component({
  selector: 'app-earlier-later',
  imports: [MatCardContent, MatDivider, MatIcon, MatCardHeader, MatCard, NgIf, AsyncPipe, NgClass],
  templateUrl: './earlier-later.component.html',
  styleUrl: './earlier-later.component.scss',
})
export class EarlierLaterCategoryComponent extends CommonQuestionComponent {
  selectedOptionName: string | null = null;
  isChecked = false;

  constructor(questionService: QuestionService) {
    super(questionService);
  }

  /**
   * Zwraca pełną datę (YYYY-MM-DD), jeśli istnieje w bazie.
   * W przeciwnym wypadku zwraca sam rok (obsługując erę p.n.e.).
   */
  getFormattedDate(answer: any): string {
    if (!answer) return '';

    // 1. Sprawdzamy oryginalny obiekt wydarzenia (jeśli loader przekazał go w całości)
    // Jeśli exact_date istnieje i nie jest puste
    if (answer.exact_date && answer.exact_date.trim() !== '') {
      return answer.exact_date.trim();
    }

    // 2. Fallback: Jeśli mamy tylko rok
    if (answer.year !== undefined && answer.year !== null) {
      return answer.year < 0 ? `${Math.abs(answer.year)} p.n.e.` : answer.year.toString();
    }

    return '';
  }

  selectOption(chosenEventName: string, correctEventName: any) {
    if (this.isChecked) return;

    this.selectedOptionName = chosenEventName;
    this.isChecked = true;

    // Popychamy serwis – to da sygnał do AnswerComponent, że czas pokazać przycisk "Dobrze / Źle"
    this.questionService.revealAnswer(0);

    console.log(
      `[POJEDYNEK] Kliknięto: ${chosenEventName}. Poprawna odpowiedź: ${correctEventName}`
    );
  }

  getOptionClass(optionValue: string, correctEventName: any): string {
    if (!this.isChecked) return '';
    if (optionValue === correctEventName) return 'correct-glow';
    if (this.selectedOptionName === optionValue && optionValue !== correctEventName)
      return 'wrong-glow';
    return 'dimmed';
  }
}
