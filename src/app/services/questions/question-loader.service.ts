import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Question } from '../../shared/questions/question.interface';
import { SupabaseService } from '../supabase.service';

import { BOGOWIE } from '../../shared/questions/gods.questions';
import { HISTORIA } from '../../shared/questions/history.questions';
import { STADIONY } from '../../shared/questions/stadiums.questions';
import { PRZYSLOWIA } from '../../shared/questions/proverbs.questions';
import { KLUBOWE_PRZYDOMKI } from '../../shared/questions/footballClubsNames.questions';
import { BUDOWLE } from '../../shared/questions/buildings.questions';
import { CZOLOWKI_SERIALI } from '../../shared/questions/tvSeriesIntro.questions';
import { IMPREZY_SPORTOWE } from '../../shared/questions/footballChampionsMusic.questions';
import { HYMNY_PANSTWOWE } from '../../shared/questions/nationalAnthems.questions';
import { BAJKOWE_INTRO } from '../../shared/questions/fairyTalesIntros.questions';
import { DANE_PANSTW } from '../../shared/questions/countries.questions';
import { CountryProvider } from '../../shared/providers/country.provider';
import { FootballGridProvider } from '../../shared/providers/football-grid.provider';
import { mapOldFamiliadaToNew } from '../../shared/mappers/familiada.mapper';
import { mapCountriesToQuestions } from '../../shared/mappers/countries.mapper';
import {
  getMovieCharacters,
  getMovieIdByTitle,
  getTvCharacters,
  getTvIdByTitle,
} from '../../shared/apiHelper/actor.helper';

@Injectable({ providedIn: 'root' })
export class QuestionLoaderService {
  private cache = new Map<string, Question[]>();

  constructor(
    private supabaseService: SupabaseService,
    private http: HttpClient
  ) {}

  private normalizeTitle(title: string): string {
    if (!title) return '';
    let t = title.trim();

    if (t.toUpperCase().endsWith(' V')) t = t.replace(/ V$/i, ' 5');
    else if (t.toUpperCase().endsWith(' IV')) t = t.replace(/ IV$/i, ' 4');
    else if (t.toUpperCase().endsWith(' III')) t = t.replace(/ III$/i, ' 3');
    else if (t.toUpperCase().endsWith(' II')) t = t.replace(/ II$/, ' 2');

    return t;
  }

  async load(type: string, name: string): Promise<Question[]> {
    const normalizedName = name.trim();
    const cacheKey = `${type}:${normalizedName.toLowerCase()}`;

    if (this.cache.has(cacheKey)) {
      console.log(`[QuestionLoader] Cache hit dla: ${normalizedName}`);
      return this.cache.get(cacheKey)!;
    }

    if (type === 'ticTacToe' && name === 'Piłkarskie kółko i krzyżyk') {
      const questions = FootballGridProvider.getGridQuestions(50);
      this.cache.set(cacheKey, questions);
      return questions;
    }

    if (type === 'photo-fragments' && name === 'Jaki to herb piłkarski?') {
      try {
        console.log(`[QuestionLoader] Losuję 50 herbów z bazy danych...`);
        const randomClubs = await this.supabaseService.getRandomClubs(50);

        const mappedQuestions: Question[] = randomClubs.map((club: any) => ({
          id: club.id,
          question: club.file_name,
          answers: [{ label: 'odpowiedz', value: club.name }],
          hints: [
            { id: 'h1', label: 'Odsłoń pierwsze fragmenty logo', content: '3', penaltyPercent: 0 },
            { id: 'h2', label: 'Odsłoń kolejne fragmenty logo', content: '5', penaltyPercent: 20 },
            { id: 'h3', label: 'Odsłoń kolejne fragmenty logo', content: '10', penaltyPercent: 20 },
          ],
          revealedAnswers: [],
        }));

        this.cache.set(cacheKey, mappedQuestions);
        return mappedQuestions;
      } catch (error) {
        console.error('Błąd podczas ładowania herbów z RPC, używam fallbacku...', error);
      }
    }

    let loadedQuestions: Question[] = [];
    const lowerName = normalizedName.toLowerCase();

    try {
      const dbQuestions =
        await this.supabaseService.getQuestionsByCategoryWithAdditional(normalizedName);

      if (dbQuestions && dbQuestions.length > 0) {
        // Przetwarzamy asynchronicznie i pozwalamy na zwrócenie null, jeśli API zawiedzie
        const mappedResults = await Promise.all(
          (dbQuestions as any[]).map(async (q) => {
            // A. KATEGORIA: OBSADA FILMOWA
            if (lowerName.includes('obsada') && lowerName.includes('film')) {
              return {
                ...q,
                question: `W jakim filmie zagrała taka obsada?`,
                hints: [
                  {
                    id: 'h_desc',
                    label: 'Pokaż opis fabuły / obsadę',
                    content: q.question,
                    penaltyPercent: 20,
                  },
                  ...(q.hints || []),
                ],
                revealedAnswers: [],
              };
            }

            // B. KATEGORIA: OBSADA SERIALOWA
            else if (lowerName.includes('obsada') && lowerName.includes('serial')) {
              return {
                ...q,
                question: `W jakim serialu zagrała taka obsada?`,
                hints: [
                  {
                    id: 'h_desc',
                    label: 'Pokaż opis fabuły / obsadę',
                    content: q.question,
                    penaltyPercent: 20,
                  },
                  ...(q.hints || []),
                ],
                revealedAnswers: [],
              };
            }

            // C. KATEGORIA: FILM PO BOHATERACH
            else if (lowerName.includes('bohaterach') && lowerName.includes('film')) {
              const rawTitle = q.answers && q.answers[0] ? q.answers[0].value : '';
              const title = this.normalizeTitle(rawTitle);
              let heroes: string | null = null;

              if (title) {
                try {
                  let movieId = await getMovieIdByTitle(title);
                  if (movieId) {
                    heroes = await getMovieCharacters(movieId, 5);
                  } else {
                    let tvId = await getTvIdByTitle(title);
                    if (tvId) heroes = await getTvCharacters(tvId, 5);
                  }
                } catch (e) {
                  console.error(`[QuestionLoader] Błąd API dla filmu: ${title}`, e);
                }
              }

              // Super szczelny bezpiecznik dla sekcji C oraz D:
              if (
                !heroes ||
                heroes.trim() === '' ||
                heroes.length < 8 ||
                heroes.toLowerCase().includes('brak danych') ||
                heroes.toLowerCase().includes('brak przypisanych') ||
                heroes.toLowerCase().includes('błąd pobierania') ||
                heroes.toLowerCase().includes('błąd ładowania') ||
                heroes.toLowerCase().includes('nie znaleziono')
              ) {
                console.warn(
                  `[QuestionLoader] Pomięto pozycję "${rawTitle}" z powodu braku realnych danych w TMDB.`
                );
                return null;
              }

              return {
                ...q,
                question: `Jaki to film po bohaterach?`,
                hints: [
                  {
                    id: 'h_heroes',
                    label: 'Pokaż imiona bohaterów (z API)',
                    content: heroes,
                    penaltyPercent: 25,
                  },
                ],
                revealedAnswers: [],
              };
            }

            // D. KATEGORIA: SERIAL PO BOHATERACH (Z PEŁNĄ IZOLACJĄ BŁĘDÓW)
            else if (lowerName.includes('bohaterach') && lowerName.includes('serial')) {
              const rawTitle = q.answers && q.answers[0] ? q.answers[0].value : '';
              const title = this.normalizeTitle(rawTitle);
              let heroes: string | null = null;

              if (title) {
                // 1. Próba znalezienia jako SERIAL
                try {
                  const tvId = await getTvIdByTitle(title);
                  if (tvId) {
                    heroes = await getTvCharacters(tvId, 5);
                  }
                } catch (e) {
                  console.warn(
                    `[QuestionLoader] Brak serialu dla "${title}" w TMDB, sprawdzam filmy...`
                  );
                }

                // 2. Awaryjny Cross-Check: Jeśli nie znaleziono serialu lub funkcja zwróciła tekstowy błąd
                if (
                  !heroes ||
                  heroes.toLowerCase().includes('brak') ||
                  heroes.toLowerCase().includes('błąd')
                ) {
                  try {
                    const movieId = await getMovieIdByTitle(title);
                    if (movieId) {
                      heroes = await getMovieCharacters(movieId, 5);
                    }
                  } catch (e) {
                    console.error(
                      `[QuestionLoader] Błąd całkowity API (TV/Film) dla tytułu: ${title}`,
                      e
                    );
                  }
                }
              }

              // D. KATEGORIA: SERIAL PO BOHATERACH
              if (
                !heroes ||
                heroes.trim() === '' ||
                heroes.length < 8 ||
                heroes.toLowerCase().includes('brak danych') ||
                heroes.toLowerCase().includes('brak przypisanych') ||
                heroes.toLowerCase().includes('błąd pobierania') ||
                heroes.toLowerCase().includes('błąd ładowania') ||
                heroes.toLowerCase().includes('nie znaleziono')
              ) {
                console.warn(
                  `[QuestionLoader] Pomięto pozycję "${rawTitle}" z powodu braku realnych danych w TMDB.`
                );
                return null;
              }

              return {
                ...q,
                question: `Jaki to serial po bohaterach?`,
                hints: [
                  {
                    id: 'h_heroes',
                    label: 'Pokaż imiona bohaterów (z API)',
                    content: heroes,
                    penaltyPercent: 25,
                  },
                ],
                revealedAnswers: [],
              };
            } else if (type === 'familiada') {
              return mapOldFamiliadaToNew(q);
            } else {
              return q;
            }
          })
        );

        // Kluczowy krok: odrzucamy wszystkie null-e
        loadedQuestions = mappedResults.filter((q): q is Question => q !== null);
      }
    } catch (error) {
      console.warn(
        `[QuestionLoader] Błąd bazy dla ${normalizedName}, sprawdzam fallback...`,
        error
      );
    }

    if (loadedQuestions.length === 0) {
      const key = `${type}:${normalizedName}`;
      const strategyKey = Object.keys(this.OLD_STRATEGIES).find(
        (k) => k.toLowerCase() === key.toLowerCase()
      );

      if (strategyKey) {
        console.log(`[QuestionLoader] Fallback: ładuję z pliku dla ${strategyKey}`);
        loadedQuestions = await this.OLD_STRATEGIES[strategyKey]();
      }
    }

    if (loadedQuestions.length > 0) {
      this.cache.set(cacheKey, loadedQuestions);
    } else {
      console.error(`[QuestionLoader] Brak pytań dla: ${type}:${normalizedName}`);
    }

    return loadedQuestions;
  }

  clearCache() {
    this.cache.clear();
  }

  private readonly OLD_STRATEGIES: Record<string, () => Promise<Question[]> | any> = {
    'one-answer:Film': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/movies.questions.json')),
    'one-answer:Seriale': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/tvSeries.questions.json')),
    'one-answer:Symbole Chemiczne': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/chemists.questions.json')),
    'one-answer:Gry': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/games.questions.json')),
    'one-answer:Bogowie': () => BOGOWIE,
    'one-answer:Historia': () => HISTORIA,
    'one-answer:Fizyka': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/physics.questions.json')),
    'one-answer:Miasto - Województwo': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/polishDistricts.questions.json')),
    'one-answer:Nazwy stadionów': () => STADIONY,
    'one-answer:Piłka nożna - wielkie imprezy': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/football.questions.json')),
    'one-answer:Przysłowia': () => PRZYSLOWIA,
    'one-answer:Klubowe przydomki': () => KLUBOWE_PRZYDOMKI,
    'one-answer:Stolice krajów': () => CountryProvider.getCapitals(),
    'hints:Fragmenty piosenek': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/songs.questions.json')),
    'hints:Artysta po tytułach piosenek': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/musicArtists.questions.json')),
    'hints:Film po bohaterach': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/movieHeroes.questions.json')),
    'hints:Serial po bohaterach': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/tvSeriesHeroes.questions.json')),
    'hints:Miasta świata': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/worldCities.questions.json')),
    'hints:Łaicnskie sentencje': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/latinMaxims.questions.json')),
    'hints:Reżyser po filmach': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/directors.questions.json')),
    'hints:Odległosci miedzymiastowe': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/citiesDistance.questions.json')),
    'photos:Znane postacie': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/famousPeople.questions.json')),
    'photos:Budowle': () => BUDOWLE,
    'photos:Flagi': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/flag.questions.json')),
    'photo-hints:W jakim filmie zagrała taka obsada?': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/moviesActors.questions.json')),
    'photo-hints:W jakim serialu zagrała taka obsada?': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/tvSeriesActors.questions.json')),
    'music:Jaka to Melodia?': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/music.questions.json')),
    'music:Czołówki seriali': () => CZOLOWKI_SERIALI,
    'music:Piosenki mistrzostw': () => IMPREZY_SPORTOWE,
    'music:Hymny Panstwowe': () => HYMNY_PANSTWOWE,
    'music:Bajkowe Intro': () => BAJKOWE_INTRO,
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
    'writting-category:Państwa z kontynentu': () => CountryProvider.getCountriesByContinent(),
    'writting-category:Stolice z kontynentu': () => CountryProvider.getCapitalsByContinent(),
    'writting-category:Państwa na literę': () => CountryProvider.getCountriesByLetter(),
    'writting-category:Stolice na literę': () => CountryProvider.getCapitalsByLetter(),
    'footballGame:Był taki mecz': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/footballGames.questions.json')),
    'country:Jaki to kraj?': () => mapCountriesToQuestions(DANE_PANSTW),
    'hints:Lektury': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/books.questions.json')),
  };
}
