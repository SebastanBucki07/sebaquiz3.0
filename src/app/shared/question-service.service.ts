import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FILMY } from './questions/movies.questions';
import { Question } from './questions/question.interface';
import {BOOKS} from './questions/books.questions';

@Injectable({ providedIn: 'root' })
export class QuestionService {

  private currentQuestion$ = new BehaviorSubject<Question | null>(null);
  readonly question$ = this.currentQuestion$.asObservable();

  private usedQuestions: Question[] = [];


  loadRandomQuestion(type: string, name: string) {
    const questions = this.getQuestions(type, name);

    const availableQuestions = questions.filter(
      q => !this.usedQuestions.some(uq => uq.id === q.id)
    );

    if (availableQuestions.length === 0) {
      alert('Wszystkie pytania zostały wyświetlone!'); // 🔥 alert
      return;
    }

    const random = {
      ...availableQuestions[Math.floor(Math.random() * availableQuestions.length)],
      showAnswer: false,
      revealedAnswers: [] // reset odpowiedzi
    };

    this.usedQuestions.push(random);
    this.currentQuestion$.next(random);
  }


  revealAnswer(index: number) {
    const q = this.currentQuestion$.value;
    if (!q) return;

    if (!q.revealedAnswers) q.revealedAnswers = [];

    // dodajemy tylko wybraną odpowiedź
    if (!q.revealedAnswers.includes(index)) {
      q.revealedAnswers.push(index);
    }

    // nie ustawiamy showAnswer
    this.currentQuestion$.next({ ...q });
  }

  getCurrentQuestion() {
    return this.currentQuestion$.value;
  }

  resetQuestions() {
    this.usedQuestions = [];
    const q = this.currentQuestion$.value;
    if (!q) return;

    // resetujemy odkryte odpowiedzi
    q.revealedAnswers = [];
    this.currentQuestion$.next({ ...q, showAnswer: false });
  }

  /** ✅ PUBLIC: checks if there are any more questions in a given category */
  hasMoreQuestions(type: string, name: string): boolean {
    const questions = this.getQuestions(type, name);
    const used = this.usedQuestions.filter(q => questions.some(aq => aq.id === q.id));
    return used.length < questions.length;
  }

  private getQuestions(type: string, name: string): Question[] {
    if (type === 'one-answer' && name === 'Film') {
      return FILMY;
    }
    if (type === 'hints' && name === 'Lektury') {
      return BOOKS;
    }
    return [];
  }
}
