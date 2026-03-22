import { Injectable } from '@angular/core';
import { QuestionHistoryService } from './question-history.service';
import { QuestionEnricherService } from './question-enricher.service';
import { HintProviderService } from '../hint/hint-provider.service';
import { QuestionClassifierService } from './question-classifier.service';
import { Question } from '../../shared/questions/question.interface';

@Injectable({ providedIn: 'root' })
export class QuestionSelectorService {
  constructor(
    private history: QuestionHistoryService,
    private enricher: QuestionEnricherService,
    private hintProvider: HintProviderService,
    private classifier: QuestionClassifierService
  ) {}

  async getNextValidQuestion(
    allQuestions: Question[],
    type: string,
    name: string
  ): Promise<Question | null> {
    const key = `${type}-${name}`;
    let available = this.history.getAvailable(allQuestions, key);

    while (available.length > 0) {
      const randomIndex = Math.floor(Math.random() * available.length);
      let question: Question = {
        ...available[randomIndex],
        revealedAnswers: [],
        showAnswer: false,
      };

      try {
        // 1. Wzbogacanie (zdjęcia/linki)
        question = await this.enricher.enrich(question, type, name);

        // 2. Podpowiedzi automatyczne
        if (this.classifier.needsHints(question)) {
          question.hints = await this.hintProvider.fetchHints(question);
        }

        return question; // Zwracamy pierwsze poprawne
      } catch (error) {
        console.warn('Pomijam pytanie z powodu błędu:', error);
        available.splice(randomIndex, 1);
      }
    }

    return null;
  }
}
