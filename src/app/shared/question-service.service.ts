import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FILMY} from './questions/movies.questions';
import {Question} from './questions/question.interface';

@Injectable({ providedIn: 'root' })
export class QuestionService {

  private currentQuestion$ = new BehaviorSubject<Question | null>(null);

  readonly question$ = this.currentQuestion$.asObservable();

  loadRandomQuestion(type: string, name: string) {
    const questions = this.getQuestions(type, name);
    const random = {
      ...questions[Math.floor(Math.random() * questions.length)],
      showAnswer: false
    };

    this.currentQuestion$.next(random);
  }

  revealAnswer() {
    const q = this.currentQuestion$.value;
    console.log('REVEAL', q);

    if (!q) return;

    this.currentQuestion$.next({
      ...q,
      showAnswer: true
    });
  }

  hideAnswer() {
    const q = this.currentQuestion$.value;
    if (!q) return;

    this.currentQuestion$.next({ ...q, showAnswer: false });
  }

  getCurrentQuestion() {
    return this.currentQuestion$.value;
  }

  private getQuestions(type: string, name: string): Question[] {
    if (type === 'one-answer' && name === 'Film') {
      return FILMY;
    }
    return [];
  }
}
