import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { SupabaseService } from '../supabase.service';
import { Question } from '../../shared/questions/question.interface';

import { CountryProvider } from '../../shared/providers/country.provider';
import { FootballGridProvider } from '../../shared/providers/football-grid.provider';
import { mapOldFamiliadaToNew } from '../../shared/mappers/familiada.mapper';
import { mapCountriesToQuestions } from '../../shared/mappers/countries.mapper';
import {
  getMovieCharacters,
  getMovieIdByTitle,
  getTopMoviesByDirector,
  getTvCharacters,
  getTvIdByTitle,
} from '../../shared/apiHelper/actor.helper';

import { CZOLOWKI_SERIALI } from '../../shared/questions/tvSeriesIntro.questions';
import { IMPREZY_SPORTOWE } from '../../shared/questions/footballChampionsMusic.questions';
import { HYMNY_PANSTWOWE } from '../../shared/questions/nationalAnthems.questions';
import { BAJKOWE_INTRO } from '../../shared/questions/fairyTalesIntros.questions';
import { BOGOWIE } from '../../../../depricatedData/gods.questions';
import { STADIONY } from '../../../../depricatedData/stadiums.questions';
import { PRZYSLOWIA } from '../../../../depricatedData/proverbs.questions';
import { KLUBOWE_PRZYDOMKI } from '../../../../depricatedData/footballClubsNames.questions';
import { BUDOWLE } from '../../../../depricatedData/buildings.questions';

@Injectable({ providedIn: 'root' })
export class QuestionLoaderService {
  private http = inject(HttpClient);
  private supabaseService = inject(SupabaseService);

  private cache = new Map<string, Question[]>();
  private isGeoInitialized = false;
  private geoDataRaw: any[] = [];

  /**
   * Główna metoda ładująca pytania.
   */
  async load(type: string, name: string): Promise<Question[]> {
    const cleanType = type.trim();
    const cleanName = name.trim();
    const cacheKey = `${cleanType}:${cleanName.toLowerCase()}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    let questions: Question[] = [];

    if (this.isGeographyCategory(cleanType, cleanName)) {
      questions = await this.handleGeography(cleanName);
    } else if (cleanType === 'ticTacToe' && cleanName.toLowerCase().includes('kółko i krzyżyk')) {
      questions = FootballGridProvider.getGridQuestions(50);
    } else if (
      cleanType === 'photo-fragments' &&
      cleanName.toLowerCase() === 'jaki to herb piłkarski?'
    ) {
      questions = await this.handleFootballCrests();
    }
    else if (
      cleanName.toLowerCase().includes('historia') ||
      cleanName.toLowerCase().includes('kto to zrobił?')
    ) {
      console.log(`[DEBUG NOWA BAZA] Przechwycono kategorię historyczną: "${cleanName}"`);
      questions = await this.handleDynamicHistory(cleanName);
    } else {
      questions = await this.handleDatabaseQuestions(cleanType, cleanName);
    }

    if (questions.length === 0) {
      questions = await this.handleFallbackStrategies(cleanType, cleanName);
    }

    if (questions.length > 0) {
      this.cache.set(cacheKey, questions);
    }

    return questions;
  }

  clearCache(): void {
    this.cache.clear();
    this.isGeoInitialized = false;
    this.geoDataRaw = [];
  }

  private isGeographyCategory(type: string, name: string): boolean {
    const geoNames = [
      'Jaki to kraj?',
      'Stolice krajów',
      'Miasta świata',
      'Państwa z kontynentu',
      'Stolice z kontynentu',
      'Państwa na literę',
      'Stolice na literę',
      'Flagi',
      'Fragmenty Flag',
    ];
    const validTypes = [
      'country',
      'one-answer',
      'hints',
      'writting-category',
      'photos',
      'photo-fragments',
    ];
    return validTypes.includes(type) && geoNames.includes(name);
  }

  private async handleGeography(name: string): Promise<Question[]> {
    try {
      if (!this.isGeoInitialized) {
        this.geoDataRaw = await this.supabaseService.getCountries();
        if (this.geoDataRaw?.length > 0) {
          CountryProvider.countries = this.geoDataRaw;
        }
        this.isGeoInitialized = true;
      }

      let geoQuestions: Question[] = [];
      const lowerName = name.toLowerCase();

      switch (lowerName) {
        case 'jaki to kraj?':
          geoQuestions = mapCountriesToQuestions(this.geoDataRaw, this.geoDataRaw);
          break;
        case 'stolice krajów':
          geoQuestions = CountryProvider.getCapitals();
          break;
        case 'państwa z kontynentu':
          geoQuestions = CountryProvider.getCountriesByContinent();
          break;
        case 'stolice z kontynentu':
          geoQuestions = CountryProvider.getCapitalsByContinent();
          break;
        case 'państwa na literę':
          geoQuestions = CountryProvider.getCountriesByLetter();
          break;
        case 'stolice na literę':
          geoQuestions = CountryProvider.getCapitalsByLetter();
          break;
        case 'miasta świata':
          geoQuestions = CountryProvider.getMajorCities();
          break;
        case 'flagi':
          geoQuestions = CountryProvider.getFlags();
          break;
        case 'fragmenty flag':
          geoQuestions = CountryProvider.getFlagFragments();
          break;
      }

      return this.getRandomSubset(geoQuestions, 50);
    } catch (error) {
      console.error(`[DEBUG GEO] BŁĄD GEOGRAFII:`, error);
      return [];
    }
  }

  private async handleFootballCrests(): Promise<Question[]> {
    try {
      const randomClubs = await this.supabaseService.getRandomClubs(50);
      return randomClubs.map((club: any) => ({
        id: club.id,
        question: club.file_name,
        answers: [{ label: 'odpowiedz', value: club.name }],
        hints: [
          { id: 'h1', label: 'Odsłoń pierwsze fragmenty', content: '10', penaltyPercent: 10 },
          { id: 'h2', label: 'Odsłoń więcej fragmentów', content: '20', penaltyPercent: 20 },
          { id: 'h3', label: 'Odsłoń resztę', content: '30', penaltyPercent: 40 },
        ],
        revealedAnswers: [],
      }));
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  private async handleDynamicHistory(name: string): Promise<Question[]> {
    try {
      const lowerName = name.toLowerCase().trim();

      if (lowerName.includes('kto to zrobił?')) {
        console.log('[DEBUG HISTORIA] Ładuję postacie historyczne (one-answer)...');
        const events = await this.supabaseService.getEventsWithPersons(50);

        return events.map((e: any) => ({
          id: e.id,
          type: 'one-answer',
          question: `Kto jest odpowiedzialny za to wydarzenie lub odkrycie: "${e.event_name}"?`,
          answers: [{ label: 'odpowiedz', value: e.person.trim() }],
          hints: [],
          revealedAnswers: [],
        }));
      }

      if (lowerName.includes('historia')) {
        console.log('[DEBUG HISTORIA] Ładuję daty (one-answer + exact_date)...');
        const events = await this.supabaseService.getRandomHistoryEvents(50);

        return events.map((e: any) => {
          let questionText = '';
          let correctAnswer = '';

          if (e.exact_date && e.exact_date.trim() !== '') {
            questionText = `Podaj dokładną datę wydarzenia (w formacie RRRR-MM-DD): ${e.event_name}`;
            correctAnswer = e.exact_date.trim();
          } else {
            const formattedYear = e.year < 0 ? `${Math.abs(e.year)} p.n.e.` : e.year.toString();
            questionText = `W którym roku miało miejsce to wydarzenie: ${e.event_name}?`;
            correctAnswer = formattedYear.trim();
          }

          return {
            id: e.id,
            type: 'one-answer',
            question: questionText,
            answers: [{ label: 'odpowiedz', value: correctAnswer }],
            hints: [],
            revealedAnswers: [],
          };
        });
      }

      if (lowerName.includes('co było wcześniej')) {
        console.log('[DEBUG HISTORIA] Ładuję serię pytań dla: Co było wcześniej...');

        const pool = await this.supabaseService.getRandomHistoryEvents(100);
        if (!pool || pool.length < 2) return [];

        const dynamicQuestions: any[] = [];
        const usedIds = new Set<number>();

        while (dynamicQuestions.length < 15 && pool.length - usedIds.size >= 2) {
          const availablePool = pool.filter((e) => !usedIds.has(e.id));
          if (availablePool.length < 2) break;

          const baseEvent = availablePool[Math.floor(Math.random() * availablePool.length)];

          const maxYearDiff = 50;
          let rivalEvent = availablePool.find(
            (e) => e.id !== baseEvent.id && Math.abs(e.year - baseEvent.year) <= maxYearDiff
          );

          if (!rivalEvent) {
            rivalEvent = availablePool.find((e) => e.id !== baseEvent.id);
          }

          if (!rivalEvent) break;

          usedIds.add(baseEvent.id);
          usedIds.add(rivalEvent.id);

          const pair = [baseEvent, rivalEvent];
          const initialOrder = [...pair].sort(() => Math.random() - 0.5);
          const earlierEvent = pair[0].year < pair[1].year ? pair[0] : pair[1];

          dynamicQuestions.push({
            id: baseEvent.id,
            question: 'Które wydarzenie miało miejsce wcześniej?',
            answers: [
              {
                label: 'Opcja A',
                value: initialOrder[0].event_name,
                year: initialOrder[0].year,
                exact_date: initialOrder[0].exact_date,
              } as any,
              {
                label: 'Opcja B',
                value: initialOrder[1].event_name,
                year: initialOrder[1].year,
                exact_date: initialOrder[1].exact_date,
              } as any,
            ],
            hints: [earlierEvent.event_name],
            revealedAnswers: [],
          });
        }

        return dynamicQuestions;
      }

      if (lowerName.includes('uszereguj chronologicznie')) {
        console.log('[DEBUG HISTORIA] Ładuję serię pytań dla: Sortowanie chronologiczne...');

        const pool = await this.supabaseService.getRandomHistoryEvents(60);
        if (!pool || pool.length < 5) return [];

        const dynamicQuestions: any[] = [];
        let currentIndex = 0;

        const shuffledPool = [...pool].sort(() => Math.random() - 0.5);

        while (currentIndex + 5 <= shuffledPool.length && dynamicQuestions.length < 8) {
          const roundEvents = shuffledPool.slice(currentIndex, currentIndex + 5);
          currentIndex += 5;

          const correctOrder = [...roundEvents].sort((a, b) => a.year - b.year);
          const shuffledOrder = [...roundEvents].sort(() => Math.random() - 0.5);

          dynamicQuestions.push({
            id: roundEvents[0].id,
            question: 'Uporządkuj wydarzenia chronologicznie (od najdawniejszego do najnowszego):',
            answers: shuffledOrder.map(
              (e) =>
                ({
                  label: 'event',
                  value: e.event_name,
                  year: e.year,
                }) as any
            ),
            hints: correctOrder.map((e) => e.event_name),
            revealedAnswers: [],
          });
        }

        return dynamicQuestions;
      }

      return [];
    } catch (error) {
      console.error(`[QuestionLoader] Błąd ładowania dynamicznej historii:`, error);
      return [];
    }
  }

  private async handleDatabaseQuestions(type: string, name: string): Promise<Question[]> {
    try {
      const lowerName = name.toLowerCase().trim();

      let categoryToQuery = name.trim();

      if (lowerName === 'serial po bohaterach') {
        categoryToQuery = 'Serial po bohaterach';
      } else if (lowerName === 'film po bohaterach') {
        categoryToQuery = 'Film po bohaterach';
      } else if (lowerName.includes('reżyser')) {
        categoryToQuery = 'Reżyser po filmach';
      } else if (lowerName.includes('obsada') && lowerName.includes('serial')) {
        categoryToQuery = 'W jakim serialu zagrała taka obsada?';
      } else if (lowerName.includes('obsada') && lowerName.includes('film')) {
        categoryToQuery = 'W jakim filmie zagrała taka obsada?';
      }

      console.log(`[DEBUG BAZA] Wywołuję Supabase dla precyzyjnej kategorii: "${categoryToQuery}"`);
      const dbQuestions =
        await this.supabaseService.getQuestionsByCategoryWithAdditional(categoryToQuery);

      console.log(
        `[DEBUG BAZA] Supabase zwrócił dla "${categoryToQuery}": ${dbQuestions?.length || 0} pytań.`
      );
      if (!dbQuestions || dbQuestions.length === 0) return [];

      let processed = await Promise.all(
        (dbQuestions as any[]).map(async (q) => {
          if (type === 'familiada') return mapOldFamiliadaToNew(q);

          if (lowerName.includes('bohater')) {
            return await this.enrichWithTmdbHeroes(q, lowerName);
          }

          if (lowerName.includes('reżyser')) {
            return await this.enrichWithTmdbDirector(q);
          }

          if (lowerName.includes('obsada')) {
            const visualType = lowerName.includes('film') ? 'filmie' : 'serialu';
            return {
              ...q,
              question: `W jakim ${visualType} zagrała taka obsada?`,
              hints: [
                {
                  id: 'h_desc',
                  label: 'Pokaż opis fabuły / obsadę',
                  content: q.question,
                  penaltyPercent: 20,
                },
                ...(q.hints || []),
              ],
              revealedAnswers: q.revealedAnswers || [],
            };
          }

          return q as Question;
        })
      );

      const filteredQuestions = processed.filter((q): q is Question => q !== null);

      if (lowerName.includes('obsada')) {
        return this.getRandomSubset(filteredQuestions, 50);
      }

      return filteredQuestions;
    } catch (e) {
      console.warn('Błąd podczas pobierania pytań z Supabase:', e);
      return [];
    }
  }

  private async handleFallbackStrategies(type: string, name: string): Promise<Question[]> {
    const lowerName = name.toLowerCase().trim();

    const strategyKey = Object.keys(this.OLD_STRATEGIES).find((k) => {
      const parts = k.split(':');
      const categoryPart = parts[1] ? parts[1].toLowerCase().trim() : parts[0].toLowerCase().trim();
      return categoryPart === lowerName;
    });

    if (!strategyKey) {
      console.warn(
        `[DEBUG FALLBACK] Brak zdefiniowanej strategii pliku JSON dla kategorii: "${name}"`
      );
      return [];
    }

    console.log(`[DEBUG FALLBACK] Ładuję dane z pliku lokalnego dla: "${strategyKey}"`);
    const rawQuestions: Question[] = await this.OLD_STRATEGIES[strategyKey]();

    if (lowerName.includes('bohater')) {
      const processedFallback = await Promise.all(
        rawQuestions.map(async (q) => {
          return await this.enrichWithTmdbHeroes(q, lowerName);
        })
      );
      return processedFallback.filter((item): item is Question => item !== null);
    }

    if (lowerName.includes('reżyser')) {
      const processedFallback = await Promise.all(
        rawQuestions.map(async (q) => {
          return await this.enrichWithTmdbDirector(q);
        })
      );
      return processedFallback.filter((item): item is Question => item !== null);
    }

    return rawQuestions;
  }

  /**
   * Pobiera imiona bohaterów z zewnętrznego API TMDB i dokleja jako podpowiedź.
   */
  private async enrichWithTmdbHeroes(q: any, lowerCategoryName: string): Promise<Question | null> {
    const rawTitle = q.answers?.[0]?.value || '';
    const title = this.normalizeTitle(rawTitle);
    if (!title) return null;

    try {
      let heroes: string | null = null;
      const isTv = lowerCategoryName.includes('serial');

      if (isTv) {
        const tvId = await getTvIdByTitle(title);
        if (tvId) heroes = await getTvCharacters(tvId, 5, title);
      } else {
        const movieId = await getMovieIdByTitle(title);
        if (movieId) heroes = await getMovieCharacters(movieId, 5, title);
      }

      if (!heroes || this.isInvalidHeroesData(heroes)) return null;

      return {
        ...q,
        type: 'hints',
        question: isTv ? 'Jaki to serial po bohaterach?' : 'Jaki to film po bohaterach?',
        hints: [
          { id: 'h_heroes', label: 'Pokaż imiona bohaterów', content: heroes, penaltyPercent: 25 },
        ],
        revealedAnswers: q.revealedAnswers || [],
      };
    } catch (e) {
      console.error(`[API TMDB ERROR] Problem z tytułem: ${title}`, e);
      return null;
    }
  }

  private async enrichWithTmdbDirector(q: any): Promise<Question | null> {
    const directorName = q.answers?.[0]?.value || '';
    if (!directorName) return null;

    try {
      const movies = await getTopMoviesByDirector(directorName, 5);

      if (
        !movies ||
        movies.startsWith('Nie znaleziono') ||
        movies.startsWith('Brak filmów') ||
        movies.startsWith('Błąd')
      ) {
        console.warn(`[TMDB REGULATOR] Odrzucono reżysera "${directorName}" – brak filmów w API.`);
        return null;
      }

      return {
        ...q,
        type: 'hints',
        question: 'Reżyser po filmach',
        hints: [
          {
            id: 'h_director_movies',
            label: 'Pokaż filmy tego reżysera',
            content: movies,
            penaltyPercent: 25,
          },
        ],
        revealedAnswers: q.revealedAnswers || [],
      };
    } catch (e) {
      console.error(`[API TMDB ERROR] Problem z reżyserem: ${directorName}`, e);
      return null;
    }
  }

  private normalizeTitle(title: string): string {
    if (!title) return '';
    let t = title.trim();
    const romanToArabic: Record<string, string> = {
      ' V': ' 5',
      ' IV': ' 4',
      ' III': ' 3',
      ' II': ' 2',
    };
    for (const [roman, arabic] of Object.entries(romanToArabic)) {
      if (t.toUpperCase().endsWith(roman)) return t.substring(0, t.length - roman.length) + arabic;
    }
    return t;
  }

  private isInvalidHeroesData(heroes: string): boolean {
    const h = heroes.toLowerCase();
    const invalidPhrases = [
      'brak danych',
      'brak przypisanych',
      'błąd pobierania',
      'błąd ładowania',
      'nie znaleziono',
    ];
    return (
      heroes.trim() === '' ||
      heroes.length < 8 ||
      invalidPhrases.some((phrase) => h.includes(phrase))
    );
  }

  private getRandomSubset<T>(array: T[], size: number): T[] {
    if (!array || array.length === 0) return [];
    return [...array].sort(() => 0.5 - Math.random()).slice(0, size);
  }

  private readonly OLD_STRATEGIES: Record<string, () => Promise<Question[]>> = {
    'one-answer:Film': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/movies.questions.json')),
    'one-answer:Seriale': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/tvSeries.questions.json')),
    'one-answer:Symbole Chemiczne': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/chemists.questions.json')),
    'one-answer:Gry': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/games.questions.json')),
    'one-answer:Bogowie': async () => BOGOWIE,
    'one-answer:Historia': async () => {
      return await this.handleDynamicHistory('historia');
    },
    'hints:Kto to zrobił?': async () => {
      return await this.handleDynamicHistory('kto to zrobił?');
    },
    'true-false:Co było wcześniej': async () => {
      return await this.handleDynamicHistory('co było wcześniej');
    },
    'chronology:Uszereguj chronologicznie': async () => {
      return await this.handleDynamicHistory('uszereguj chronologicznie');
    },
    'one-answer:Fizyka': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/physics.questions.json')),
    'one-answer:Miasto - Województwo': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/polishDistricts.questions.json')),
    'one-answer:Nazwy stadionów': async () => STADIONY,
    'one-answer:Piłka nożna - wielkie imprezy': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/football.questions.json')),
    'one-answer:Przysłowia': async () => PRZYSLOWIA,
    'one-answer:Klubowe przydomki': async () => KLUBOWE_PRZYDOMKI,
    'one-answer:Stolice krajów': async () => CountryProvider.getCapitals(),

    'hints:Fragmenty piosenek': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/songs.questions.json')),
    'hints:Artysta po tytułach piosenek': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/musicArtists.questions.json')),
    'hints:Film po bohaterach': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/movieHeroes.questions.json')),

    'hints:Serial po bohaterach': async () => {
      return await this.supabaseService.getQuestionsByCategoryWithAdditional(
        'Serial po bohaterach'
      );
    },

    'hints:Miasta świata': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/worldCities.questions.json')),
    'hints:Łaicnskie sentencje': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/latinMaxims.questions.json')),

    'hints:Reżyser po filmach': async () => {
      return await this.supabaseService.getQuestionsByCategoryWithAdditional('Reżyser po filmach');
    },

    'hints:Odległosci miedzymiastowe': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/citiesDistance.questions.json')),

    'photos:Znane postacie': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/famousPeople.questions.json')),
    'photos:Budowle': async () => BUDOWLE,
    'photos:Flagi': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/flag.questions.json')),

    'photo-hints:W jakim filmie zagrała taka obsada?': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/moviesActors.questions.json')),
    'photo-hints:W jakim serialu zagrała taka obsada?': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/tvSeriesActors.questions.json')),

    'music:Jaka to Melodia?': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/music.questions.json')),
    'music:Czołówki seriali': async () => CZOLOWKI_SERIALI,
    'music:Piosenki mistrzostw': async () => IMPREZY_SPORTOWE,
    'music:Hymny Panstwowe': async () => HYMNY_PANSTWOWE,
    'music:Bajkowe Intro': async () => BAJKOWE_INTRO,

    'photo-fragments:Jakie to logo?': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/logoFragments.questions.json')),
    'photo-fragments:Jaki to herb piłkarski?': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/footballCrests.questions.json')),
    'photo-fragments:Fragmenty Flag': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/flagFragments.questions.json')),

    'writting-category:Wypisywanie róznych wspólnych': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/writings.questions.json')),
    'writting-category:Wypisywanie róznych wspólnych - piłka nożna': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/writingsFootball.questions.json')),
    'writting-category:Państwa z kontynentu': async () => CountryProvider.getCountriesByContinent(),
    'writting-category:Stolice z kontynentu': async () => CountryProvider.getCapitalsByContinent(),
    'writting-category:Państwa na literę': async () => CountryProvider.getCountriesByLetter(),
    'writting-category:Stolice na literę': async () => CountryProvider.getCapitalsByLetter(),

    'footballGame:Był taki mecz': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/footballGames.questions.json')),
    'country:Jaki to kraj?': async () => {
      const data =
        this.geoDataRaw.length > 0 ? this.geoDataRaw : await this.supabaseService.getCountries();
      return mapCountriesToQuestions(data, data);
    },
    'hints:Lektury': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/books.questions.json')),
  };
}
