import { Question } from '../shared/questions/question.interface';
import { BehaviorSubject } from 'rxjs';
import { QuestionHistoryService } from './questions/question-history.service';
import { Injectable } from '@angular/core';
import { QuestionSelectorService } from './questions/question-selector.service';
import { QuestionLoaderService } from './questions/question-loader.service';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private currentQuestionSubject = new BehaviorSubject<Question | null>(null);
  readonly question$ = this.currentQuestionSubject.asObservable();

  constructor(
    private loader: QuestionLoaderService,
    private selector: QuestionSelectorService,
    private history: QuestionHistoryService
  ) {}

  async loadRandomQuestion(type: string, name: string): Promise<void> {
    const allQuestions = await this.loader.load(type, name);
    const key = `${type}-${name}`;

    const validQuestion = await this.selector.getNextValidQuestion(allQuestions, type, name);

    if (validQuestion) {
      this.history.markAsUsed(validQuestion, key);
      this.currentQuestionSubject.next(validQuestion);
    } else {
      // Zamiast alertu możesz wyemitować błąd do UI
      console.error('Brak dostępnych pytań');
      this.currentQuestionSubject.next(null);
    }
  }

  getCurrentQuestion(): Question | null {
    return this.currentQuestionSubject.value;
  }

  revealAnswer(index: number): void {
    const q = this.currentQuestionSubject.value;
    if (!q) return;

    const revealed = [...(q.revealedAnswers || [])];
    if (!revealed.includes(index)) {
      this.currentQuestionSubject.next({
        ...q,
        revealedAnswers: [...revealed, index],
      });
    }
  }

  async getRemainingQuestions(type: string, name: string): Promise<number> {
    const all = await this.loader.load(type, name);
    return this.history.getAvailable(all, `${type}-${name}`).length;
  }

  resetQuestions(): void {
    this.history.reset();
    this.currentQuestionSubject.next(null);
  }
}
