import { Injectable } from '@angular/core';
import { Question } from '../../shared/questions/question.interface';

@Injectable({ providedIn: 'root' })
export class QuestionClassifierService {
  needsHints(question: Question): boolean {
    // Rzutowanie na any pozwala ominąć błąd kompilacji
    const catId = (question as any).category_id;

    if (catId === 37 || catId === 38) {
      return true;
    }

    const qText = question.question?.toLowerCase() || '';
    return qText.includes('obsada') || qText.includes('bohaterach');
  }
}
