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


@Injectable({providedIn: 'root'})
export class QuestionLoaderService {
  private cache = new Map<string, Question[]>();
  private isGeoInitialized = false;
  private geoDataRaw: any[] = [];

  constructor(private supabaseService: SupabaseService, private http: HttpClient) {
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
            // w question-loader.service.ts
            geoQuestions = this.getRandomSubset(mapCountriesToQuestions(this.geoDataRaw, this.geoDataRaw),50);
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
            const questions = this.getRandomSubset(CountryProvider.getMajorCities(),50);
            geoQuestions = questions;
            break;
          case 'flagi':
            geoQuestions = this.getRandomSubset(CountryProvider.getFlags(),50);
            break;
          case 'fragmenty flag':
            geoQuestions = this.getRandomSubset(CountryProvider.getFlagFragments(),50);
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
    // 3. HERBY PIŁKARSKIE
    if (type === 'photo-fragments' && cleanName.toLowerCase() === 'jaki to herb piłkarski?') {
      try {
        const randomClubs = await this.supabaseService.getRandomClubs(50);
        const mappedQuestions: Question[] = randomClubs.map((club: any) => ({
          id: club.id,
          question: club.file_name, // To jest ścieżka do obrazka herbu
          answers: [{label: 'odpowiedz', value: club.name}],
          hints: [
            {
              id: 'h1',
              label: 'Odsłoń pierwsze fragmenty',
              content: '10', // Pierwszy poziom odsłonięcia
              penaltyPercent: 10
            },
            {
              id: 'h2',
              label: 'Odsłoń więcej fragmentów',
              content: '20', // Drugi poziom
              penaltyPercent: 20
            },
            {
              id: 'h3',
              label: 'Odsłoń resztę',
              content: '30', // Trzeci poziom
              penaltyPercent: 40
            }
          ],
          revealedAnswers: [],
        }));
        this.cache.set(cacheKey, mappedQuestions);
        return mappedQuestions;
      } catch (e) {
        console.error(e);
      }
    }

    // 4. PYTANIA Z BAZY (FILMY/SERIALE/FAMILIADA)
    let loadedQuestions: Question[] = [];
    try {
      const dbQuestions = await this.supabaseService.getQuestionsByCategoryWithAdditional(normalizedName);
      if (dbQuestions && dbQuestions.length > 0) {
        loadedQuestions = (await Promise.all((dbQuestions as any[]).map(async (q) => {
          if (type === 'familiada') return mapOldFamiliadaToNew(q);
          return q;
        }))).filter((q): q is Question => q !== null);
      }
    } catch (e) {
      console.warn(e);
    }

    // 5. FALLBACK
    if (loadedQuestions.length === 0) {
      const strategyKey = Object.keys(this.OLD_STRATEGIES).find(
        (k) => k.toLowerCase() === cacheKey.toLowerCase()
      );

      if (strategyKey) {
        console.log(`[DEBUG FALLBACK] Ładowanie strategii z pliku JSON dla klucza: ${strategyKey}`);
        loadedQuestions = await this.OLD_STRATEGIES[strategyKey]();
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
