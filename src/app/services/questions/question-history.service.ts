import { Injectable } from '@angular/core';
import { Question } from '../../shared/questions/question.interface';

@Injectable({ providedIn: 'root' })
export class QuestionHistoryService {
  private usedQuestions: Record<string, string[]> = {}; // Przechowujemy tylko ID

  getAvailable(questions: Question[], key: string): Question[] {
    const usedIds = this.usedQuestions[key] || [];
    return questions.filter((q) => !usedIds.includes(q.id.toString()));
  }

  markAsUsed(question: Question, key: string): void {
    if (!this.usedQuestions[key]) {
      this.usedQuestions[key] = [];
    }
    this.usedQuestions[key].push(question.id.toString());
  }

  reset(): void {
    this.usedQuestions = {};
  }
}
