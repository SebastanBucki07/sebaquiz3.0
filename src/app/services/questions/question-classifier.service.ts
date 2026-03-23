import { Injectable } from '@angular/core';
import { Question } from '../../shared/questions/question.interface';

@Injectable({ providedIn: 'root' })
export class QuestionClassifierService {
  needsHints(question: Question): boolean {
    const qText = question.question?.toLowerCase() || '';
    return qText.includes('obsada') || qText.includes('zagrała taka obsada');
  }
}
