import {Injectable} from '@angular/core';
import {Question} from '../../shared/questions/question.interface';
import {SupabaseService} from '../supabase.service';
import {BOGOWIE} from '../../shared/questions/gods.questions';
import {HISTORIA} from '../../shared/questions/history.questions';
import {STADIONY} from '../../shared/questions/stadiums.questions';
import {PRZYSLOWIA} from '../../shared/questions/proverbs.questions';
import {KLUBOWE_PRZYDOMKI} from '../../shared/questions/footballClubsNames.questions';
import {CountryProvider} from '../../shared/providers/country.provider';
import {BUDOWLE} from '../../shared/questions/buildings.questions';
import {CZOLOWKI_SERIALI} from '../../shared/questions/tvSeriesIntro.questions';
import {IMPREZY_SPORTOWE} from '../../shared/questions/footballChampionsMusic.questions';
import {HYMNY_PANSTWOWE} from '../../shared/questions/nationalAnthems.questions';
import {BAJKOWE_INTRO} from '../../shared/questions/fairyTalesIntros.questions';
import {FootballGridProvider} from '../../shared/providers/football-grid.provider';
import {mapOldFamiliadaToNew} from '../../shared/mappers/familiada.mapper';
import {FAMILIADA_RAW} from '../../shared/questions/familiada.questions';
import {mapCountriesToQuestions} from '../../shared/mappers/countries.mapper';
import {DANE_PANSTW} from '../../shared/questions/countries.questions';
import {firstValueFrom} from 'rxjs';
import {HttpClient} from '@angular/common/http'; // Twoje stałe

@Injectable({providedIn: 'root'})
export class QuestionLoaderService {
  constructor(private supabaseService: SupabaseService, private http: HttpClient) {
  }


  async load(type: string, name: string): Promise<Question[]> {
    const key = `${type}:${name}`;

    if (key === 'one-answer:Biologia') {
      return await this.supabaseService.getQuestions('BIOLOGIA');
    }

    if (key === 'one-answer:Test') {
      return await this.supabaseService.getQuestions('TEST');
    }

    if (key === 'hints:Lektury') {
      return await this.supabaseService.getQuestions('BOOKS');
    }

    const loader = this.OLD_STRATEGIES[key];

    if (loader) {
      return await loader();
    }

    return [];
  }

  private readonly OLD_STRATEGIES: Record<string, () => any> = {
    'one-answer:Film': () => firstValueFrom(this.http.get('/questions/movies.questions.json')),
    'one-answer:Seriale': () => firstValueFrom(this.http.get('/questions/tvSeries.questions.json')),
    'one-answer:Symbole Chemiczne': () => firstValueFrom(this.http.get('/questions/chemists.questions.json')),
    'one-answer:Gry': () => firstValueFrom(this.http.get('/questions/games.questions.json')),
    'one-answer:Bogowie': () => BOGOWIE,
    'one-answer:Historia': () => HISTORIA,
    'one-answer:Fizyka': () => firstValueFrom(this.http.get('/questions/physics.questions.json')),
    'one-answer:Miasto - Województwo': () => firstValueFrom(this.http.get('/questions/polishDistricts.questions.json')),
    'one-answer:Nazwy stadionów': () => STADIONY,
    'one-answer:Piłka nożna - wielkie imprezy': () => firstValueFrom(this.http.get('/questions/football.questions.json')),
    'one-answer:Przysłowia': () => PRZYSLOWIA,
    'one-answer:Klubowe przydomki': () => KLUBOWE_PRZYDOMKI,
    'one-answer:Stolice krajów': () => CountryProvider.getCapitals(),


    // Hints

    'hints:Fragmenty piosenek': () => firstValueFrom(this.http.get('/questions/songs.questions.json')),
    'hints:Artysta po tytułach piosenek': () => firstValueFrom(this.http.get('/questions/musicArtists.questions.json')),
    'hints:Film po bohaterach': () => firstValueFrom(this.http.get('/questions/movieHeroes.questions.json')),
    'hints:Serial po bohaterach': () => firstValueFrom(this.http.get('/questions/tvSeriesHeroes.questions.json')),
    'hints:Miasta świata': () => firstValueFrom(this.http.get('/questions/worldCities.questions.json')),
    'hints:Łaicnskie sentencje': () => firstValueFrom(this.http.get('/questions/latinMaxims.questions.json')),
    'hints:Reżyser po filmach': () => firstValueFrom(this.http.get('/questions/directors.questions.json')),
    'hints:Odległosci miedzymiastowe': () => firstValueFrom(this.http.get('/questions/citiesDistance.questions.json')),

    // Photos
    'photos:Znane postacie': () => firstValueFrom(this.http.get('/questions/famousPeople.questions.json')),
    'photos:Budowle': () => BUDOWLE,
    'photos:Flagi': () => firstValueFrom(this.http.get('/questions/flag.questions.json')),

    // Photo Hints
    'photo-hints:Klubowa Historia piłkarza': () => firstValueFrom(this.http.get('/questions/footballHistory.questions.json')),
    'photo-hints:W jakim filmie zagrała taka obsada?': () => firstValueFrom(this.http.get('/questions/moviesActors.questions.json')),
    'photo-hints:W jakim serialu zagrała taka obsada?': () => firstValueFrom(this.http.get('/questions/tvSeriesActors.questions.json')),

    // Music
    'music:Jaka to Melodia?': () => firstValueFrom(this.http.get('/questions/music.questions.json')),
    'music:Czołówki seriali': () => CZOLOWKI_SERIALI,
    'music:Piosenki mistrzostw': () => IMPREZY_SPORTOWE,
    'music:Hymny Panstwowe': () => HYMNY_PANSTWOWE,
    'music:Bajkowe Intro': () => BAJKOWE_INTRO,

    // Photo Fragments
    'photo-fragments:Jakie to logo?': () => firstValueFrom(this.http.get('/questions/logoFragments.questions.json')),
    'photo-fragments:Jaki to herb piłkarski?': () => firstValueFrom(this.http.get('/questions/footballCrests.questions.json')),
    'photo-fragments:Fragmenty Flag': () => firstValueFrom(this.http.get('/questions/flagFragments.questions.json')),

    // Writing Category
    'writting-category:Wypisywanie róznych wspólnych': () => firstValueFrom(this.http.get('/questions/writings.questions.json')),
    'writting-category:Wypisywanie róznych wspólnych - piłka nożna': () =>
      firstValueFrom(this.http.get('/questions/writingsFootball.questions.json')),
    'writting-category:Państwa z kontynentu': () => CountryProvider.getCountriesByContinent(),
    'writting-category:Stolice z kontynentu': () => CountryProvider.getCapitalsByContinent(),
    'writting-category:Państwa na literę': () => CountryProvider.getCountriesByLetter(),
    'writting-category:Stolice na literę': () => CountryProvider.getCapitalsByLetter(),

    // Football Game
    'footballGame:Był taki mecz': () => firstValueFrom(this.http.get('/questions/footballGames.questions.json')),

    // Special Logic
    'ticTacToe:Piłkarskie kółko i krzyżyk': () => FootballGridProvider.getGridQuestions(50),

    'familiada:Familiada': () => mapOldFamiliadaToNew(FAMILIADA_RAW),
    'country:Jaki to kraj?': () => mapCountriesToQuestions(DANE_PANSTW),
  };
}
