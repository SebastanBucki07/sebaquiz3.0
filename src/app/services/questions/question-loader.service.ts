import { Injectable } from '@angular/core';
import { Question } from '../../shared/questions/question.interface';
import { QUESTION_STRATEGIES } from '../question-strategies.registry';

@Injectable({ providedIn: 'root' })
export class QuestionLoaderService {
  async load(type: string, name: string): Promise<Question[]> {
    const loader = QUESTION_STRATEGIES[`${type}:${name}`];
    return loader ? await loader() : [];
  }
}
