import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

// Modele i Serwisy
import { Question } from '../../shared/questions/question.interface';
import { SupabaseService } from '../supabase.service';

// Importy stałych (Fallback)
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
import { FAMILIADA_RAW } from '../../shared/questions/familiada.questions';
import { DANE_PANSTW } from '../../shared/questions/countries.questions';

// Providery i Mappery
import { CountryProvider } from '../../shared/providers/country.provider';
import { FootballGridProvider } from '../../shared/providers/football-grid.provider';
import { mapOldFamiliadaToNew } from '../../shared/mappers/familiada.mapper';
import { mapCountriesToQuestions } from '../../shared/mappers/countries.mapper';

@Injectable({ providedIn: 'root' })
export class QuestionLoaderService {
  // Pamięć podręczna, aby nie pobierać tych samych pytań wielokrotnie z sieci
  private cache = new Map<string, Question[]>();

  constructor(
    private supabaseService: SupabaseService,
    private http: HttpClient
  ) {}

  /**
   * Główna metoda ładująca pytania.
   * Najpierw sprawdza cache, potem algorytmy specjalne, potem bazę Supabase, a na końcu pliki lokalne.
   */
  async load(type: string, name: string): Promise<Question[]> {
    const normalizedName = name.trim();
    const cacheKey = `${type}:${normalizedName.toLowerCase()}`;

    // 1. Sprawdź, czy dane są już w pamięci podręcznej (błyskawiczne ładowanie)
    if (this.cache.has(cacheKey)) {
      console.log(`[QuestionLoader] Cache hit dla: ${normalizedName}`);
      return this.cache.get(cacheKey)!;
    }

    // 2. LOGIKA SPECJALNA (TicTacToe - generowane w locie)
    if (type === 'ticTacToe') {
      const questions = FootballGridProvider.getGridQuestions(50);
      this.cache.set(cacheKey, questions);
      return questions;
    }

    let loadedQuestions: Question[] = [];

    // 3. DATABASE FIRST - Spróbuj pobrać z Supabase
    try {
      const dbQuestions = await this.supabaseService.getQuestions(normalizedName);
      if (dbQuestions && dbQuestions.length > 0) {
        console.log(`[QuestionLoader] Załadowano z bazy: ${normalizedName}`);
        loadedQuestions = type === 'familiada' ? mapOldFamiliadaToNew(dbQuestions) : dbQuestions;
      }
    } catch (error) {
      console.warn(`[QuestionLoader] Błąd bazy dla ${normalizedName}, sprawdzam fallback...`, error);
    }

    // 4. FALLBACK - Jeśli baza jest pusta, szukaj w starych strategiach (pliki/stałe)
    if (loadedQuestions.length === 0) {
      const key = `${type}:${normalizedName}`;
      const strategyKey = Object.keys(this.OLD_STRATEGIES).find(
        k => k.toLowerCase() === key.toLowerCase()
      );

      if (strategyKey) {
        console.log(`[QuestionLoader] Fallback: ładuję z pliku dla ${strategyKey}`);
        loadedQuestions = await this.OLD_STRATEGIES[strategyKey]();
      }
    }

    // 5. Zapisz do cache, jeśli udało się coś pobrać
    if (loadedQuestions.length > 0) {
      this.cache.set(cacheKey, loadedQuestions);
    } else {
      console.error(`[QuestionLoader] Nie znaleziono pytań dla: ${type}:${normalizedName}`);
    }

    return loadedQuestions;
  }

  /**
   * Czyści pamięć podręczną (np. jeśli chcesz wymusić odświeżenie danych)
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Słownik starych metod ładowania (pliki JSON i stałe TS).
   */
  private readonly OLD_STRATEGIES: Record<string, () => Promise<Question[]> | any> = {
    // One Answer
    'one-answer:Film': () => firstValueFrom(this.http.get<Question[]>('/questions/movies.questions.json')),
    'one-answer:Seriale': () => firstValueFrom(this.http.get<Question[]>('/questions/tvSeries.questions.json')),
    'one-answer:Symbole Chemiczne': () => firstValueFrom(this.http.get<Question[]>('/questions/chemists.questions.json')),
    'one-answer:Gry': () => firstValueFrom(this.http.get<Question[]>('/questions/games.questions.json')),
    'one-answer:Bogowie': () => BOGOWIE,
    'one-answer:Historia': () => HISTORIA,
    'one-answer:Fizyka': () => firstValueFrom(this.http.get<Question[]>('/questions/physics.questions.json')),
    'one-answer:Miasto - Województwo': () => firstValueFrom(this.http.get<Question[]>('/questions/polishDistricts.questions.json')),
    'one-answer:Nazwy stadionów': () => STADIONY,
    'one-answer:Piłka nożna - wielkie imprezy': () => firstValueFrom(this.http.get<Question[]>('/questions/football.questions.json')),
    'one-answer:Przysłowia': () => PRZYSLOWIA,
    'one-answer:Klubowe przydomki': () => KLUBOWE_PRZYDOMKI,
    'one-answer:Stolice krajów': () => CountryProvider.getCapitals(),

    // Hints
    'hints:Fragmenty piosenek': () => firstValueFrom(this.http.get<Question[]>('/questions/songs.questions.json')),
    'hints:Artysta po tytułach piosenek': () => firstValueFrom(this.http.get<Question[]>('/questions/musicArtists.questions.json')),
    'hints:Film po bohaterach': () => firstValueFrom(this.http.get<Question[]>('/questions/movieHeroes.questions.json')),
    'hints:Serial po bohaterach': () => firstValueFrom(this.http.get<Question[]>('/questions/tvSeriesHeroes.questions.json')),
    'hints:Miasta świata': () => firstValueFrom(this.http.get<Question[]>('/questions/worldCities.questions.json')),
    'hints:Łaicnskie sentencje': () => firstValueFrom(this.http.get<Question[]>('/questions/latinMaxims.questions.json')),
    'hints:Reżyser po filmach': () => firstValueFrom(this.http.get<Question[]>('/questions/directors.questions.json')),
    'hints:Odległosci miedzymiastowe': () => firstValueFrom(this.http.get<Question[]>('/questions/citiesDistance.questions.json')),

    // Photos
    'photos:Znane postacie': () => firstValueFrom(this.http.get<Question[]>('/questions/famousPeople.questions.json')),
    'photos:Budowle': () => BUDOWLE,
    'photos:Flagi': () => firstValueFrom(this.http.get<Question[]>('/questions/flag.questions.json')),

    // Photo Hints
    'photo-hints:Klubowa Historia piłkarza': () => firstValueFrom(this.http.get<Question[]>('/questions/footballHistory.questions.json')),
    'photo-hints:W jakim filmie zagrała taka obsada?': () => firstValueFrom(this.http.get<Question[]>('/questions/moviesActors.questions.json')),
    'photo-hints:W jakim serialu zagrała taka obsada?': () => firstValueFrom(this.http.get<Question[]>('/questions/tvSeriesActors.questions.json')),

    // Music
    'music:Jaka to Melodia?': () => firstValueFrom(this.http.get<Question[]>('/questions/music.questions.json')),
    'music:Czołówki seriali': () => CZOLOWKI_SERIALI,
    'music:Piosenki mistrzostw': () => IMPREZY_SPORTOWE,
    'music:Hymny Panstwowe': () => HYMNY_PANSTWOWE,
    'music:Bajkowe Intro': () => BAJKOWE_INTRO,

    // Photo Fragments
    'photo-fragments:Jakie to logo?': () => firstValueFrom(this.http.get<Question[]>('/questions/logoFragments.questions.json')),
    'photo-fragments:Jaki to herb piłkarski?': () => firstValueFrom(this.http.get<Question[]>('/questions/footballCrests.questions.json')),
    'photo-fragments:Fragmenty Flag': () => firstValueFrom(this.http.get<Question[]>('/questions/flagFragments.questions.json')),

    // Writing Category
    'writting-category:Wypisywanie róznych wspólnych': () => firstValueFrom(this.http.get<Question[]>('/questions/writings.questions.json')),
    'writting-category:Wypisywanie róznych wspólnych - piłka nożna': () => firstValueFrom(this.http.get<Question[]>('/questions/writingsFootball.questions.json')),
    'writting-category:Państwa z kontynentu': () => CountryProvider.getCountriesByContinent(),
    'writting-category:Stolice z kontynentu': () => CountryProvider.getCapitalsByContinent(),
    'writting-category:Państwa na literę': () => CountryProvider.getCountriesByLetter(),
    'writting-category:Stolice na literę': () => CountryProvider.getCapitalsByLetter(),

    // Football Game
    'footballGame:Był taki mecz': () => firstValueFrom(this.http.get<Question[]>('/questions/footballGames.questions.json')),

    // Inne
    'familiada:Familiada': () => mapOldFamiliadaToNew(FAMILIADA_RAW),
    'country:Jaki to kraj?': () => mapCountriesToQuestions(DANE_PANSTW),
    'hints:Lektury': () => firstValueFrom(this.http.get<Question[]>('/questions/books.questions.json')), // Przykład fallbacku dla Lektur
  };
}
