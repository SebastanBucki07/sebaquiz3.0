import { QuestionLoader } from '../shared/models/questions/question-strategy.type';
import { BIOLOGIA } from '../shared/questions/biology.questions';
import { CHEMIST } from '../shared/questions/chemists.questions';
import { FILMY } from '../shared/questions/movies.questions';
import { GRY } from '../shared/questions/games.questions';
import { HISTORIA } from '../shared/questions/history.questions';
import { BOGOWIE } from '../shared/questions/gods.questions';
import { TV_SERIES } from '../shared/questions/tvSeries.questions';
import { MIASTO_WOJEWODZTWO } from '../shared/questions/polishDistricts.questions';
import { PRZYSLOWIA } from '../shared/questions/proverbs.questions';
import { BOOKS } from '../shared/questions/books.questions';
import { FRAGMENTY_PIOSENEK } from '../shared/questions/songs.questions';
import { ARTYSTA_PO_UTWORACH } from '../shared/questions/musicArtists.questions';
import { BOHATEROWIE_FILMOWI } from '../shared/questions/movieHeroes.questions';
import { DANE_PANSTW } from '../shared/questions/countries.questions';
import { STADIONY } from '../shared/questions/stadiums.questions';
import { PILKA_NOZNA } from '../shared/questions/football.questions';
import { BOHATEROWIE_SERIALOWI } from '../shared/questions/tvSeriesHeroes.question';
import { MIASTA_SWIATA } from '../shared/questions/worldCities.questions';
import { BUDOWLE } from '../shared/questions/buildings.questions';
import { FLAGI } from '../shared/questions/flag.questions';
import { HISTORIA_PILKARZA } from '../shared/questions/footballHistory.questions';
import { FILM_PO_AKTORACH } from '../shared/questions/moviesActors.questions';
import { JAKA_TO_MELODIA } from '../shared/questions/music.questions';
import { CZOLOWKI_SERIALI } from '../shared/questions/tvSeriesIntro.questions';
import { REZYSEROWIE } from '../shared/questions/directors.questions';
import { ZNANE_POSTACIE } from '../shared/questions/famousPeople.questions';
import { SERIAL_PO_AKTORACH } from '../shared/questions/tvSeriesActors.questions';
import { IMPREZY_SPORTOWE } from '../shared/questions/footballChampionsMusic.questions';
import { HYMNY_PANSTWOWE } from '../shared/questions/nationalAnthems.questions';
import { BAJKOWE_INTRO } from '../shared/questions/fairyTalesIntros.questions';
import { LOGO_FRAGMENTY } from '../shared/questions/logoFragments.questions';
import { HERBY_PILKARSKIE } from '../shared/questions/footballCrestsFragments.questions';
import { FRAGMENT_FLAG } from '../shared/questions/flagFragments.questions';
import { WYPISZ_WSPOLNE } from '../shared/questions/writtings.questions';
import { WYPISZ_WSPOLNE_PILKA_NOZNA } from '../shared/questions/writtingsFootball.questions';
import { MECZE_PILKARSKIE } from '../shared/questions/footaballGames.questions';
import { FAMILIADA_RAW } from '../shared/questions/familiada.questions';

import { CountryProvider } from '../shared/providers/country.provider';
import { FootballGridProvider } from '../shared/providers/football-grid.provider';
import { mapOldFamiliadaToNew } from '../shared/mappers/familiada.mapper';
import { mapCountriesToQuestions } from '../shared/mappers/countries.mapper';
import { ZNANE_CYTATY } from '../shared/questions/latinMaxims.questions';
import { KLUBOWE_PRZYDOMKI } from '../shared/questions/footballClubsNames.questions';
import { FIZYKA } from '../shared/questions/physics.questions';
import { ODLEGLOSCI_MIASTOWE } from '../shared/questions/citiesDistance.questions';

// ==========================================
// REJESTR STRATEGII
// ==========================================

export const QUESTION_STRATEGIES: Record<string, QuestionLoader> = {
  // One Answer
  'one-answer:Film': () => FILMY,
  'one-answer:Seriale': () => TV_SERIES,
  'one-answer:Symbole Chemiczne': () => CHEMIST,
  'one-answer:Gry': () => GRY,
  'one-answer:Biologia': () => BIOLOGIA,
  'one-answer:Bogowie': () => BOGOWIE,
  'one-answer:Historia': () => HISTORIA,
  'one-answer:Fizyka': () => FIZYKA,
  'one-answer:Miasto - Województwo': () => MIASTO_WOJEWODZTWO,
  'one-answer:Nazwy stadionów': () => STADIONY,
  'one-answer:Piłka nożna - wielkie imprezy': () => PILKA_NOZNA,
  'one-answer:Przysłowia': () => PRZYSLOWIA,
  'one-answer:Klubowe przydomki': () => KLUBOWE_PRZYDOMKI,
  'one-answer:Stolice krajów': () => CountryProvider.getCapitals(),

  // Hints
  'hints:Lektury': () => BOOKS,
  'hints:Fragmenty piosenek': () => FRAGMENTY_PIOSENEK,
  'hints:Artysta po tytułach piosenek': () => ARTYSTA_PO_UTWORACH,
  'hints:Film po bohaterach': () => BOHATEROWIE_FILMOWI,
  'hints:Serial po bohaterach': () => BOHATEROWIE_SERIALOWI,
  'hints:Miasta świata': () => MIASTA_SWIATA,
  'hints:Łaicnskie sentencje': () => ZNANE_CYTATY,
  'hints:Reżyser po filmach': () => REZYSEROWIE,
  'hints:Odległosci miedzymiastowe': () => ODLEGLOSCI_MIASTOWE,

  // Photos
  'photos:Znane postacie': () => ZNANE_POSTACIE,
  'photos:Budowle': () => BUDOWLE,
  'photos:Flagi': () => FLAGI,

  // Photo Hints
  'photo-hints:Klubowa Historia piłkarza': () => HISTORIA_PILKARZA,
  'photo-hints:W jakim filmie zagrała taka obsada?': () => FILM_PO_AKTORACH,
  'photo-hints:W jakim serialu zagrała taka obsada?': () => SERIAL_PO_AKTORACH,

  // Music
  'music:Jaka to Melodia?': () => JAKA_TO_MELODIA,
  'music:Czołówki seriali': () => CZOLOWKI_SERIALI,
  'music:Piosenki mistrzostw': () => IMPREZY_SPORTOWE,
  'music:Hymny Panstwowe': () => HYMNY_PANSTWOWE,
  'music:Bajkowe Intro': () => BAJKOWE_INTRO,

  // Photo Fragments
  'photo-fragments:Jakie to logo?': () => LOGO_FRAGMENTY,
  'photo-fragments:Jaki to herb piłkarski?': () => HERBY_PILKARSKIE,
  'photo-fragments:Fragmenty Flag': () => FRAGMENT_FLAG,

  // Writing Category
  'writting-category:Wypisywanie róznych wspólnych': () => WYPISZ_WSPOLNE,
  'writting-category:Wypisywanie róznych wspólnych - piłka nożna': () => WYPISZ_WSPOLNE_PILKA_NOZNA,
  'writting-category:Państwa z kontynentu': () => CountryProvider.getCountriesByContinent(),
  'writting-category:Stolice z kontynentu': () => CountryProvider.getCapitalsByContinent(),
  'writting-category:Państwa na literę': () => CountryProvider.getCountriesByLetter(),
  'writting-category:Stolice na literę': () => CountryProvider.getCapitalsByLetter(),

  // Football Game
  'footballGame:Był taki mecz': () => MECZE_PILKARSKIE,

  // Special Logic
  'ticTacToe:Piłkarskie kółko i krzyżyk': () => FootballGridProvider.getGridQuestions(50),

  'familiada:Familiada': () => mapOldFamiliadaToNew(FAMILIADA_RAW),
  'country:Jaki to kraj?': () => mapCountriesToQuestions(DANE_PANSTW),
};
