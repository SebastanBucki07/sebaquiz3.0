import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {Question} from '../../shared/questions/question.interface';
import {SupabaseService} from '../supabase.service';

import {BOGOWIE} from '../../../../depricatedData/gods.questions';
import {HISTORIA} from '../../shared/questions/history.questions';
import {STADIONY} from '../../../../depricatedData/stadiums.questions';
import {PRZYSLOWIA} from '../../../../depricatedData/proverbs.questions';
import {KLUBOWE_PRZYDOMKI} from '../../../../depricatedData/footballClubsNames.questions';
import {BUDOWLE} from '../../../../depricatedData/buildings.questions';
import {CZOLOWKI_SERIALI} from '../../shared/questions/tvSeriesIntro.questions';
import {IMPREZY_SPORTOWE} from '../../shared/questions/footballChampionsMusic.questions';
import {HYMNY_PANSTWOWE} from '../../shared/questions/nationalAnthems.questions';
import {BAJKOWE_INTRO} from '../../shared/questions/fairyTalesIntros.questions';
import {CountryProvider} from '../../shared/providers/country.provider';
import {FootballGridProvider} from '../../shared/providers/football-grid.provider';
import {mapOldFamiliadaToNew} from '../../shared/mappers/familiada.mapper';
import {mapCountriesToQuestions} from '../../shared/mappers/countries.mapper';
import {
  getMovieCharacters,
  getMovieIdByTitle,
  getTvCharacters,
  getTvIdByTitle
} from '../../shared/apiHelper/actor.helper';


@Injectable({providedIn: 'root'})
export class QuestionLoaderService {
  private cache = new Map<string, Question[]>();
  private isGeoInitialized = false;
  private geoDataRaw: any[] = [];

  constructor(private supabaseService: SupabaseService, private http: HttpClient) {
  }

  private normalizeTitle(title: string): string {
    if (!title) return '';
    let t = title.trim();
    if (t.toUpperCase().endsWith(' V')) t = t.replace(/ V$/i, ' 5');
    else if (t.toUpperCase().endsWith(' IV')) t = t.replace(/ IV$/i, ' 4');
    else if (t.toUpperCase().endsWith(' III')) t = t.replace(/ III$/i, ' 3');
    else if (t.toUpperCase().endsWith(' II')) t = t.replace(/ II$/, ' 2');
    return t;
  }

  private isInvalidHeroesData(heroes: string): boolean {
    const h = heroes.toLowerCase();
    return heroes.trim() === '' ||
      heroes.length < 8 ||
      h.includes('brak danych') ||
      h.includes('brak przypisanych') ||
      h.includes('błąd pobierania') ||
      h.includes('błąd ładowania') ||
      h.includes('nie znaleziono');
  }

  private getRandomSubset<T>(array: T[], size: number): T[] {
    return [...array].sort(() => 0.5 - Math.random()).slice(0, size);
  }

  async load(type: string, name: string): Promise<Question[]> {
    const normalizedName = name.trim();
    const cacheKey = `${type}:${normalizedName.toLowerCase()}`;

    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey)!;

    const cleanType = type.trim();
    const cleanName = name.trim();

    const isGeography =
      (cleanType === 'country' && cleanName === 'Jaki to kraj?') ||
      (cleanType === 'one-answer' && cleanName === 'Stolice krajów') ||
      (cleanType === 'hints' && cleanName === 'Miasta świata') ||
      (cleanType === 'writting-category' && cleanName === 'Państwa z kontynentu') ||
      (cleanType === 'writting-category' && cleanName === 'Stolice z kontynentu') ||
      (cleanType === 'writting-category' && cleanName === 'Państwa na literę') ||
      (cleanType === 'writting-category' && cleanName === 'Stolice na literę') ||
      (cleanType === 'photos' && cleanName === 'Flagi') ||
      (cleanType === 'photo-fragments' && cleanName === 'Fragmenty Flag');

    if (isGeography) {
      try {
        if (!this.isGeoInitialized) {
          this.geoDataRaw = await this.supabaseService.getCountries();
          if (this.geoDataRaw?.length > 0) CountryProvider.countries = this.geoDataRaw;
          this.isGeoInitialized = true;
        }

        let geoQuestions: Question[] = [];
        const lowerName = cleanName.toLowerCase();
        switch (lowerName) {
          case 'jaki to kraj?':
            geoQuestions = this.getRandomSubset(mapCountriesToQuestions(this.geoDataRaw, this.geoDataRaw), 50);
            break;
          case 'stolice krajów':
            geoQuestions = this.getRandomSubset(CountryProvider.getCapitals(), 50);
            break;
          case 'państwa z kontynentu':
            geoQuestions = this.getRandomSubset(CountryProvider.getCountriesByContinent(), 50);
            break;
          case 'stolice z kontynentu':
            geoQuestions = this.getRandomSubset(CountryProvider.getCapitalsByContinent(), 50);
            break;
          case 'państwa na literę':
            geoQuestions = this.getRandomSubset(CountryProvider.getCountriesByLetter(), 50);
            break;
          case 'stolice na literę':
            geoQuestions = this.getRandomSubset(CountryProvider.getCapitalsByLetter(), 50);
            break;
          case 'miasta świata':
            geoQuestions = this.getRandomSubset(CountryProvider.getMajorCities(), 50);
            break;
          case 'flagi':
            geoQuestions = this.getRandomSubset(CountryProvider.getFlags(), 50);
            break;
          case 'fragmenty flag':
            geoQuestions = this.getRandomSubset(CountryProvider.getFlagFragments(), 50);
            break;
        }

        if (geoQuestions.length > 0) {
          this.cache.set(cacheKey, geoQuestions);
          return geoQuestions;
        }
      } catch (error) {
        console.error(`[DEBUG GEO] BŁĄD PODCZAS OBSŁUGI GEOGRAFII:`, error);
      }
    }

    // 2. KÓŁKO I KRZYŻYK
    if (type === 'ticTacToe' && cleanName.toLowerCase().includes('kółko i krzyżyk')) {
      const questions = FootballGridProvider.getGridQuestions(50);
      this.cache.set(cacheKey, questions);
      return questions;
    }

    // 3. HERBY PIŁKARSKIE
    if (type === 'photo-fragments' && cleanName.toLowerCase() === 'jaki to herb piłkarski?') {
      try {
        const randomClubs = await this.supabaseService.getRandomClubs(50);
        const mappedQuestions: Question[] = randomClubs.map((club: any) => ({
          id: club.id,
          question: club.file_name,
          answers: [{ label: 'odpowiedz', value: club.name }],
          hints: [
            { id: 'h1', label: 'Odsłoń pierwsze fragmenty', content: '10', penaltyPercent: 10 },
            { id: 'h2', label: 'Odsłoń więcej fragmentów', content: '20', penaltyPercent: 20 },
            { id: 'h3', label: 'Odsłoń resztę', content: '30', penaltyPercent: 40 }
          ],
          revealedAnswers: [],
        }));
        this.cache.set(cacheKey, mappedQuestions);
        return mappedQuestions;
      } catch (e) {
        console.error(e);
      }
    }

    // 4. PYTANIA Z BAZY (FILMY/SERIALE/FAMILIADA + INTEGRACJA API BOHATERÓW)
    let loadedQuestions: Question[] = [];
    try {
      const dbQuestions = await this.supabaseService.getQuestionsByCategoryWithAdditional(normalizedName);
      const lowerName = normalizedName.toLowerCase();

      console.log(`[DEBUG LOADER] Pobrano z bazy dla kategorii: "${normalizedName}". Ilość pytań:`, dbQuestions?.length);

      if (dbQuestions && dbQuestions.length > 0) {
        loadedQuestions = (await Promise.all((dbQuestions as any[]).map(async (q, index) => {
          if (type === 'familiada') return mapOldFamiliadaToNew(q);

          // AGRESYWNY SELEKTOR DLA BOHATERÓW
          if (lowerName.includes('bohater')) {
            console.log(`[DEBUG LOADER] Trafiono kategorię BOHATEROWIE dla pytania [${index}]:`, q);

            const rawTitle = q.answers && q.answers[0] ? q.answers[0].value : '';
            const title = this.normalizeTitle(rawTitle);
            let heroes: string | null = null;

            if (title) {
              try {
                if (lowerName.includes('serial')) {
                  const tvId = await getTvIdByTitle(title);
                  if (tvId) heroes = await getTvCharacters(tvId, 5);
                } else {
                  const movieId = await getMovieIdByTitle(title);
                  if (movieId) heroes = await getMovieCharacters(movieId, 5);
                }
              } catch (e) {
                console.error(`[DEBUG LOADER] Błąd API TMDB dla tytułu: ${title}`, e);
              }
            }

            console.log(`[DEBUG LOADER] Wynik z TMDB dla "${title}":`, heroes);

            if (!heroes || this.isInvalidHeroesData(heroes)) {
              console.warn(`[DEBUG LOADER] Odrzucono pozycję "${rawTitle}" - brak danych w TMDB.`);
              return null;
            }

            const mappedQuestion: Question = {
              ...q,
              type: 'hints',
              question: lowerName.includes('serial') ? 'Jaki to serial po bohaterach?' : 'Jaki to film po bohaterach?',
              hints: [
                {
                  id: 'h_heroes',
                  label: 'Pokaż imiona bohaterów',
                  content: heroes,
                  penaltyPercent: 25,
                }
              ],
              revealedAnswers: q.revealedAnswers || [],
            };

            if (index === 0) {
              console.log('[DEBUG LOADER] Pierwsze zmapowane pytanie gotowe do wysłania:', mappedQuestion);
            }

            return mappedQuestion;
          }

          // A. KATEGORIA: OBSADA FILMOWA
          if (lowerName.includes('obsada') && lowerName.includes('film')) {
            return {
              ...q,
              question: `W jakim filmie zagrała taka obsada?`,
              hints: [
                { id: 'h_desc', label: 'Pokaż opis fabuły / obsadę', content: q.question, penaltyPercent: 20 },
                ...(q.hints || []),
              ],
              revealedAnswers: q.revealedAnswers || [],
            } as Question;
          }

          // B. KATEGORIA: OBSADA SERIALOWA
          if (lowerName.includes('obsada') && lowerName.includes('serial')) {
            return {
              ...q,
              question: `W jakim serialu zagrała taka obsada?`,
              hints: [
                { id: 'h_desc', label: 'Pokaż opis fabuły / obsadę', content: q.question, penaltyPercent: 20 },
                ...(q.hints || []),
              ],
              revealedAnswers: q.revealedAnswers || [],
            } as Question;
          }

          return q as Question;
        }))).filter((q): q is Question => q !== null);
      }
    } catch (e) {
      console.warn(e);
    }

    // 5. FALLBACK (PLIKI LOKALNE JSON)
    if (loadedQuestions.length === 0) {
      const strategyKey = Object.keys(this.OLD_STRATEGIES).find(
        (k) => k.toLowerCase() === cacheKey.toLowerCase()
      );

      if (strategyKey) {
        console.log(`[DEBUG FALLBACK] Ładowanie strategii z pliku JSON dla klucza: ${strategyKey}`);
        const rawJsonQuestions: Question[] = await this.OLD_STRATEGIES[strategyKey]();

        if (normalizedName.toLowerCase().includes('bohater')) {
          const processedFallback = await Promise.all(rawJsonQuestions.map(async (q) => {
            const rawTitle = q.answers && q.answers[0] ? q.answers[0].value : '';
            const title = this.normalizeTitle(rawTitle);
            let heroes: string | null = null;

            if (title) {
              if (normalizedName.toLowerCase().includes('film')) {
                const movieId = await getMovieIdByTitle(title);
                heroes = movieId ? await getMovieCharacters(movieId, 5) : null;
              } else {
                const tvId = await getTvIdByTitle(title);
                heroes = tvId ? await getTvCharacters(tvId, 5) : null;
              }
            }

            if (!heroes || this.isInvalidHeroesData(heroes)) return null;

            return {
              ...q,
              type: 'hints',
              hints: [{ id: 'h_heroes', label: 'Pokaż imiona bohaterów', content: heroes, penaltyPercent: 25 }],
              revealedAnswers: q.revealedAnswers || []
            } as Question;
          }));

          loadedQuestions = processedFallback.filter((item): item is Question => item !== null);
        } else {
          loadedQuestions = rawJsonQuestions;
        }
      } else {
        console.warn(`[DEBUG FALLBACK] Brak strategii dla klucza: ${cacheKey}`);
      }
    }

    if (loadedQuestions.length > 0) this.cache.set(cacheKey, loadedQuestions);
    return loadedQuestions;
  }

  clearCache() {
    this.cache.clear();
    this.isGeoInitialized = false;
    this.geoDataRaw = [];
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
    'country:Jaki to kraj?': async () => {
      const data = this.geoDataRaw.length > 0 ? this.geoDataRaw : await this.supabaseService.getCountries();
      return mapCountriesToQuestions(data, data);
    },
    'hints:Lektury': () =>
      firstValueFrom(this.http.get<Question[]>('/questions/books.questions.json')),
  };
}
