import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FILMY } from './questions/movies.questions';
import { Question } from './questions/question.interface';
import {BOOKS} from './questions/books.questions';
import {CHEMIST} from './questions/chemists.questions';
import {TV_SERIES} from "./questions/tvSeries.questions";
import {GRY} from "./questions/games.questions";
import {BIOLOGIA} from "./questions/biology.questions";
import {BOGOWIE} from "./questions/gods.questions";
import {HISTORIA} from "./questions/history.questions";
import {MIASTO_WOJEWODZTWO} from "./questions/polishDistricts.questions";
import {STADIONY} from "./questions/stadiums.questions";
import {PILKA_NOZNA} from "./questions/football.questions";
import {PRZYSLOWIA} from "./questions/proverbs.questions";
import {FRAGMENTY_PIOSENEK} from "./questions/songs.questions";

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
      revealedAnswers: []
    };

    this.usedQuestions.push(random);
    this.currentQuestion$.next(random);
  }


  revealAnswer(index: number) {
    const q = this.currentQuestion$.value;
    if (!q) return;

    if (!q.revealedAnswers) q.revealedAnswers = [];

    if (!q.revealedAnswers.includes(index)) {
      q.revealedAnswers.push(index);
    }

    this.currentQuestion$.next({ ...q });
  }

  getCurrentQuestion() {
    return this.currentQuestion$.value;
  }

  resetQuestions() {
    this.usedQuestions = [];
    const q = this.currentQuestion$.value;
    if (!q) return;

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
    if (type === 'one-answer' && name === 'Seriale') {
      return TV_SERIES;
    }
    if (type === 'one-answer' && name === 'Symbole Chemiczne') {
      return CHEMIST;
    }
    if (type === 'one-answer' && name === 'Gry') {
      return GRY;
    }
    if (type === 'one-answer' && name === 'Biologia') {
      return BIOLOGIA;
    }
    if (type === 'one-answer' && name === 'Bogowie') {
      return BOGOWIE;
    }
    if (type === 'one-answer' && name === 'Historia') {
      return HISTORIA;
    }
    if (type === 'one-answer' && name === 'Miasto - Województwo') {
      return MIASTO_WOJEWODZTWO;
    }
    if (type === 'one-answer' && name === 'Nazwy stadionów') {
      return STADIONY;
    }
    if (type === 'one-answer' && name === 'Piłka nożna - wielkie imprezy') {
      return PILKA_NOZNA;
    }
    if (type === 'one-answer' && name === 'Przysłowia') {
      return PRZYSLOWIA;
    }
    if (type === 'hints' && name === 'Lektury') {
      return BOOKS;
    }
    if (type === 'hints' && name === 'Fragmenty piosenek') {
      return FRAGMENTY_PIOSENEK;
    }
    return [];
  }
}
