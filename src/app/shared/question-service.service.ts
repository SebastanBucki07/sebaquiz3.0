import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FILMY} from './questions/movies.questions';

@Injectable({ providedIn: 'root' })
export class QuestionService {

  private currentQuestion$ = new BehaviorSubject<any>(null);

  get question$() {
    return this.currentQuestion$.asObservable();
  }

  loadRandomQuestion(type: string, name: string) {
    const questions = this.getQuestions(type, name);
    const random = questions[Math.floor(Math.random() * questions.length)];
    this.currentQuestion$.next(random);
  }

  private getQuestions(type: string, name: string): any[] {

    if (type === 'one-answer' && name === 'Film') {
      return FILMY;
    }

    return [];
  }
}
