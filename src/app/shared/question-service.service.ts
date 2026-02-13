import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Question } from './questions/question.interface';
import { Hint } from './category/category.interface';

import { FILMY } from './questions/movies.questions';
import { BOOKS } from './questions/books.questions';
import { CHEMIST } from './questions/chemists.questions';
import { TV_SERIES } from './questions/tvSeries.questions';
import { GRY } from './questions/games.questions';
import { BIOLOGIA } from './questions/biology.questions';
import { BOGOWIE } from './questions/gods.questions';
import { HISTORIA } from './questions/history.questions';
import { MIASTO_WOJEWODZTWO } from './questions/polishDistricts.questions';
import { STADIONY } from './questions/stadiums.questions';
import { PILKA_NOZNA } from './questions/football.questions';
import { PRZYSLOWIA } from './questions/proverbs.questions';

import { FRAGMENTY_PIOSENEK } from './questions/songs.questions';
import { ARTYSTA_PO_UTWORACH } from './questions/musicArtists.questions';
import { BOHATEROWIE_FILMOWI } from './questions/movieHeroes.questions';
import { BOHATEROWIE_SERIALOWI } from './questions/tvSeriesHeroes.question';
import { MIASTA_SWIATA } from './questions/worldCities.questions';
import { REZYSEROWIE } from './questions/directors.questions';

import { ZNANE_POSTACIE } from './questions/famousPeople.questions';
import { BUDOWLE } from './questions/buildings.questions';
import { FLAGI } from './questions/flag.questions';

import { HISTORIA_PILKARZA } from './questions/footballHistory.questions';
import { FILM_PO_AKTORACH } from './questions/moviesActors.questions';
import { SERIAL_PO_AKTORACH } from './questions/tvSeriesActors.questions';

import {
  getActorPhotoByName,
  getImageUrl,
  getMovieCast,
  getMovieIdByTitle,
  getTvCast,
  getTvIdByTitle,
} from './apiHelper/actor.helper';
import {JAKA_TO_MELODIA} from './questions/music.questions';
import {CZOLOWKI_SERIALI} from './questions/tvSeriesIntro.questions';
import {IMPREZY_SPORTOWE} from './questions/footballChampionsMusic.questions';
import {LOGO_FRAGMENTY} from './questions/logoFragments.questions';

@Injectable({ providedIn: 'root' })
export class QuestionService {

  private currentQuestionSubject = new BehaviorSubject<Question | null>(null);
  readonly question$ = this.currentQuestionSubject.asObservable();

  private usedQuestions: Question[] = [];

  // =========================
  // PUBLIC
  // =========================

  async loadRandomQuestion(type: string, name: string): Promise<void> {
    const questions = await this.getQuestions(type, name);

    const available = questions.filter(
      q => !this.usedQuestions.some(uq => uq.id === q.id)
    );

    if (!available.length) {
      alert('Wszystkie pytania zostały wyświetlone!');
      return;
    }

    let question: Question = {
      ...available[Math.floor(Math.random() * available.length)],
      showAnswer: false,
      revealedAnswers: []
    };

    question = await this.enrichQuestion(question, type, name);

    this.usedQuestions.push(question);
    this.currentQuestionSubject.next(question);
  }

  revealAnswer(index: number): void {
    const q = this.currentQuestionSubject.value;
    if (!q) return;

    q.revealedAnswers ??= [];

    if (!q.revealedAnswers.includes(index)) {
      q.revealedAnswers.push(index);
    }

    console.log(`revelad answer: ${JSON.stringify(q.revealedAnswers)}`)
    this.currentQuestionSubject.next({ ...q });
  }

  resetQuestions(): void {
    this.usedQuestions = [];

    const q = this.currentQuestionSubject.value;
    if (!q) return;

    this.currentQuestionSubject.next({
      ...q,
      revealedAnswers: [],
      showAnswer: false
    });
  }

  getCurrentQuestion(): Question | null {
    return this.currentQuestionSubject.value;
  }

  async hasMoreQuestions(type: string, name: string): Promise<boolean> {
    const all = await this.getQuestions(type, name);
    const used = this.usedQuestions.filter(q =>
      all.some(aq => aq.id === q.id)
    );
    return used.length < all.length;
  }

  async getRemainingQuestions(type: string, name: string): Promise<number> {
    const all = await this.getQuestions(type, name);
    const used = this.usedQuestions.filter(q =>
      all.some(aq => aq.id === q.id)
    );
    return all.length - used.length;
  }

  updateCurrentQuestion(question: Question): void {
    this.currentQuestionSubject.next({ ...question });
  }

  // =========================
  // ENRICHERS (ANTI-SPAGHETTI)
  // =========================

  private async enrichQuestion(
    question: Question,
    type: string,
    name: string
  ): Promise<Question> {

    if (type === 'photos' && name === 'Znane postacie') {
      return this.enrichFamousPeople(question);
    }

    return question;
  }

  private async enrichFamousPeople(question: Question): Promise<Question> {
    const q = question.question;

    if (q?.toLowerCase().includes('piast-gliwice.eu')) {
      return question;
    }


    if (q?.includes('fwcdn.pl')) {
      const actorName = question.answers?.[0]?.value;
      if (!actorName) return question;

      const photo = await getActorPhotoByName(actorName);


      if (photo.includes('no-image')) {
        await this.loadRandomQuestion('photos', 'Znane postacie');
        return this.getCurrentQuestion()!;
      }

      return { ...question, question: photo };
    }

    if (q?.startsWith('http')) {
      const isValid = await this.checkImageUrl(q);
      if (!isValid) {
        await this.loadRandomQuestion('photos', 'Znane postacie');
        return this.getCurrentQuestion()!;
      }
    }

    return question;
  }


  private async checkImageUrl(url: string): Promise<boolean> {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      return res.ok;
    } catch {
      return false;
    }
  }




  // =========================
  // DATA
  // =========================

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

    if (type === 'photo-hints' && name === 'Klubowa Historia piłkarza') return HISTORIA_PILKARZA;
    if (type === 'photo-hints' && name === 'W jakim filmie zagrała taka obsada?') return FILM_PO_AKTORACH;
    if (type === 'photo-hints' && name === 'W jakim serialu zagrała taka obsada?') return SERIAL_PO_AKTORACH;

    if (type === 'music' && name === 'Jaka to Melodia?') return JAKA_TO_MELODIA;
    if (type === 'music' && name === 'Czołówki seriali') return CZOLOWKI_SERIALI;
    if (type === 'music' && name === 'Piosenki mistrzostw') return IMPREZY_SPORTOWE;

    if (type === 'photo-fragments' && name === 'Jakie to logo?') return LOGO_FRAGMENTY;

    return [];
  }

  // =========================
  // HINTS
  // =========================

  async fetchHintsForQuestion(question: Question): Promise<Hint[]> {
    if (!question.answers?.length) return [];

    const title = question.answers[0].value;
    const isTv = question.question === 'W jakim serialu zagrała taka obsada?';

    const id = isTv
      ? await getTvIdByTitle(title)
      : await getMovieIdByTitle(title);

    if (!id) return [];

    const cast = isTv
      ? await getTvCast(id, 8)
      : await getMovieCast(id, 8);

    return cast.map((actor, index) => ({
      id: index.toString(),
      label: actor.name,
      content: actor.profile_path
        ? getImageUrl(actor.profile_path)
        : 'assets/no-image.png',
      penaltyPercent: 0
    }));
  }
}
