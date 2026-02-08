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
import {ARTYSTA_PO_UTWORACH} from "./questions/musicArtists.questions";
import {BOHATEROWIE_FILMOWI} from "./questions/movieHeroes.questions";
import {BOHATEROWIE_SERIALOWI} from "./questions/tvSeriesHeroes.question";
import {MIASTA_SWIATA} from "./questions/worldCities.questions";
import {REZYSEROWIE} from "./questions/directors.questions";
import {ZNANE_POSTACIE} from './questions/famousPeople.questions';
import {BUDOWLE} from './questions/buildings.questions';
import {FLAGI} from './questions/flag.questions';
import {HISTORIA_PILKARZA} from './questions/footballHistory.questions';
import {FILM_PO_AKTORACH} from './questions/moviesActors.questions';
import {
  getImageUrl,
  getMovieCast,
  getMovieIdByTitle,
  getTvCast,
  getTvIdByTitle,
} from './apiHelper/actor.helper';
import {Hint} from './category/category.interface';
import {SERIAL_PO_AKTORACH} from './questions/tvSeriesActors.questions';

@Injectable({ providedIn: 'root' })
export class QuestionService {

  private currentQuestion$ = new BehaviorSubject<Question | null>(null);
  readonly question$ = this.currentQuestion$.asObservable();

  private usedQuestions: Question[] = [];

  async loadRandomQuestion(type: string, name: string) {
    const questions = await this.getQuestions(type, name);

    const availableQuestions = questions.filter(
      q => !this.usedQuestions.some(uq => uq.id === q.id)
    );

    if (availableQuestions.length === 0) {
      alert('Wszystkie pytania zostały wyświetlone!');
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
  async hasMoreQuestions(type: string, name: string): Promise<boolean> {
    const questions = await this.getQuestions(type, name);
    const used = this.usedQuestions.filter(q =>
      questions.some(aq => aq.id === q.id)
    );
    return used.length < questions.length;
  }


  private async getQuestions(type: string, name: string): Promise<Question[]> {

    if (type === 'one-answer' && name === 'Film') return FILMY;
    if (type === 'one-answer' && name === 'Seriale') return TV_SERIES;
    if (type === 'one-answer' && name === 'Symbole Chemiczne') return CHEMIST;
    if (type === 'one-answer' && name === 'Gry') return GRY;
    if (type === 'one-answer' && name === 'Biologia') return BIOLOGIA;
    if (type === 'one-answer' && name === 'Bogowie') return BOGOWIE;
    if (type === 'one-answer' && name === 'Historia') return HISTORIA;
    if (type === 'one-answer' && name === 'Miasto - Województwo') return MIASTO_WOJEWODZTWO;
    if (type === 'one-answer' && name === 'Nazwy stadionów') return STADIONY;
    if (type === 'one-answer' && name === 'Piłka nożna - wielkie imprezy') return PILKA_NOZNA;
    if (type === 'one-answer' && name === 'Przysłowia') return PRZYSLOWIA;

    if (type === 'hints' && name === 'Lektury') return BOOKS;
    if (type === 'hints' && name === 'Fragmenty piosenek') return FRAGMENTY_PIOSENEK;
    if (type === 'hints' && name === 'Artysta po tytułach piosenek') return ARTYSTA_PO_UTWORACH;
    if (type === 'hints' && name === 'Film po bohaterach') return BOHATEROWIE_FILMOWI;
    if (type === 'hints' && name === 'Serial po bohaterach') return BOHATEROWIE_SERIALOWI;
    if (type === 'hints' && name === 'Miasta świata') return MIASTA_SWIATA;
    if (type === 'hints' && name === 'Reżyser po filmach') return REZYSEROWIE;

    if (type === 'photos' && name === 'Znane postacie') return ZNANE_POSTACIE;
    if (type === 'photos' && name === 'Budowle') return BUDOWLE;
    if (type === 'photos' && name === 'Flagi') return FLAGI;

    if (type === 'photo-hints' && name === 'Klubowa Historia piłkarza') {
      return HISTORIA_PILKARZA;
    }

    if (type === 'photo-hints' && name === 'W jakim filmie zagrała taka obsada?') {
      return FILM_PO_AKTORACH
    }

    if (type === 'photo-hints' && name === 'W jakim serialu zagrała taka obsada?') {
      return SERIAL_PO_AKTORACH
    }

    // 👇 TWARDY fallback (TS2366 znika)
    return [];
  }

  async getRemainingQuestions(
    type: string,
    name: string
  ): Promise<number> {
    const all = await this.getQuestions(type, name);
    const used = this.usedQuestions.filter(q =>
      all.some(aq => aq.id === q.id)
    );
    return all.length - used.length;
  }

  async fetchHintsForQuestion(question: Question): Promise<Hint[]> {
    if (!question.answers?.length) return [];

    const title = question.answers[0].value;

    const isTv =
      question.question === 'W jakim serialu zagrała taka obsada?';

    const id = isTv
      ? await getTvIdByTitle(title)
      : await getMovieIdByTitle(title);

    if (!id) return [];

    const actors = isTv
      ? await getTvCast(id, 8)
      : await getMovieCast(id, 8);

    return actors.map((actor, index) => ({
      id: index.toString(),
      label: actor.name,
      content: actor.profile_path
        ? getImageUrl(actor.profile_path)
        : 'assets/no-image.png',
      penaltyPercent: 0
    }));
  }


  updateCurrentQuestion(question: Question) {
    this.currentQuestion$.next({ ...question });
  }




}
