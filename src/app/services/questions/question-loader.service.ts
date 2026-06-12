import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { SupabaseService } from '../supabase.service';
import { Question } from '../../shared/questions/question.interface';

// Mapowania i Providery
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
import { HISTORIA } from '../../shared/questions/history.questions';
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

    // 1. Obsługa specyficznych typów (Geografia, Kółko i Krzyżyk, Herby)
    if (this.isGeographyCategory(cleanType, cleanName)) {
      questions = await this.handleGeography(cleanName);
    } else if (cleanType === 'ticTacToe' && cleanName.toLowerCase().includes('kółko i krzyżyk')) {
      questions = FootballGridProvider.getGridQuestions(50);
    } else if (
      cleanType === 'photo-fragments' &&
      cleanName.toLowerCase() === 'jaki to herb piłkarski?'
    ) {
      questions = await this.handleFootballCrests();
    } else {
      // 2. Obsługa bazy danych Supabase (w tym Bohaterowie, Obsada i Reżyserzy)
      questions = await this.handleDatabaseQuestions(cleanType, cleanName);
    }

    // 3. Fallback do plików lokalnych JSON, jeśli baza nic nie zwróciła
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

  // ==========================================
  // METODY PRYWATNE - SEKCJE LOGICZNE
  // ==========================================

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

  private async handleDatabaseQuestions(type: string, name: string): Promise<Question[]> {
    try {
      const lowerName = name.toLowerCase().trim();

      // Sztywny mapownik nazw, aby upewnić się, że do Supabase leci IDEALNY string
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

          // 1. Kategoria: Bohaterowie
          if (lowerName.includes('bohater')) {
            return await this.enrichWithTmdbHeroes(q, lowerName);
          }

          // 2. Kategoria: Reżyserzy
          if (lowerName.includes('reżyser')) {
            return await this.enrichWithTmdbDirector(q);
          }

          // 3. Kategoria: Obsada
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

    const strategyKey = Object.keys(this.OLD_STRATEGIES).find(k => {
      const parts = k.split(':');
      const categoryPart = parts[1] ? parts[1].toLowerCase().trim() : parts[0].toLowerCase().trim();
      return categoryPart === lowerName;
    });

    if (!strategyKey) {
      console.warn(`[DEBUG FALLBACK] Brak zdefiniowanej strategii pliku JSON dla kategorii: "${name}"`);
      return [];
    }

    console.log(`[DEBUG FALLBACK] Ładuję dane z pliku lokalnego dla: "${strategyKey}"`);
    const rawQuestions: Question[] = await this.OLD_STRATEGIES[strategyKey]();

    // Jeśli fallback dotyczy bohaterów, to przechodzimy przez enrichment z TMDB
    if (lowerName.includes('bohater')) {
      const processedFallback = await Promise.all(rawQuestions.map(async (q) => {
        return await this.enrichWithTmdbHeroes(q, lowerName);
      }));
      return processedFallback.filter((item): item is Question => item !== null);
    }

    // Jeśli fallback dotyczy reżyserów, przechodzimy przez enrichment dla reżysera
    if (lowerName.includes('reżyser')) {
      const processedFallback = await Promise.all(rawQuestions.map(async (q) => {
        return await this.enrichWithTmdbDirector(q);
      }));
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

  /**
   * Pobiera najpopularniejsze filmy reżysera z zewnętrznego API TMDB i dokleja jako podpowiedź.
   */
  private async enrichWithTmdbDirector(q: any): Promise<Question | null> {
    const directorName = q.answers?.[0]?.value || '';
    if (!directorName) return null;

    try {
      const movies = await getTopMoviesByDirector(directorName, 5);

      if (!movies || movies.startsWith('Nie znaleziono') || movies.startsWith('Brak filmów') || movies.startsWith('Błąd')) {
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
            penaltyPercent: 25
          },
        ],
        revealedAnswers: q.revealedAnswers || [],
      };
    } catch (e) {
      console.error(`[API TMDB ERROR] Problem z reżyserem: ${directorName}`, e);
      return null;
    }
  }

  // ==========================================
  // METODY POMOCNICZE (UTILITIES)
  // ==========================================

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

  // ==========================================
  // REJESTR STRATEGII PLIKÓW LOKALNYCH / BAZY
  // ==========================================

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
    'one-answer:Historia': async () => HISTORIA,
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
      return await this.supabaseService.getQuestionsByCategoryWithAdditional(
        'Reżyser po filmach'
      );
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
