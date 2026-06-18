import { DANE_PANSTW } from '../../../app/shared/questions/countries.questions';
import FLAGI_JSON from '../../../../public/questions/flag.questions.json'; // Ścieżka do pliku z flagami
import MIASTA_JSON from '../../../../public/questions/worldCities.questions.json';
import * as isoCountries from 'i18n-iso-countries';
import langPl from 'i18n-iso-countries/langs/pl.json';

// Rejestracja pakietu języka polskiego w bibliotece
isoCountries.registerLocale(langPl);

// Funkcja pomocnicza do pobierania kodu ISO na podstawie polskiej nazwy
function pobierzKodISO(nazwaPanstwa: string): string {
  // Biblioteka szuka kodu (np. "PL") na podstawie polskiej nazwy
  const kod = isoCountries.getAlpha2Code(nazwaPanstwa, 'pl');

  if (!kod) {
    // Jeśli biblioteka czegoś nie znajdzie (np. przez inną pisownię),
    // wypisze ostrzeżenie w konsoli, żebyś mógł to ręcznie poprawić
    console.warn(`⚠️ Nie znaleziono kodu dla państwa: "${nazwaPanstwa}"`);
    return nazwaPanstwa;
  }

  return kod;
}

const mapaFlag = new Map<string, string>();

if (FLAGI_JSON && Array.isArray(FLAGI_JSON)) {
  FLAGI_JSON.forEach((item: any) => {
    if (item.answers && item.answers[0] && item.answers[0].value && item.question) {
      const nazwaPanstwa = item.answers[0].value.trim();
      const urlFlagi = item.question;
      mapaFlag.set(nazwaPanstwa, urlFlagi);
    }
  });
}

// 2. Mapa dla miast [Nazwa Kraju] -> Set z unikalnymi miastami
const mapaMiast = new Map<string, Set<string>>();

if (MIASTA_JSON && Array.isArray(MIASTA_JSON)) {
  MIASTA_JSON.forEach((item: any) => {
    if (item.answers && item.answers[0] && item.answers[0].value) {
      const nazwaPanstwa = item.answers[0].value.trim();

      // Jeśli nie mamy jeszcze tego państwa w mapie, tworzymy nowy Set
      if (!mapaMiast.has(nazwaPanstwa)) {
        mapaMiast.set(nazwaPanstwa, new Set<string>());
      }

      const zestawMiast = mapaMiast.get(nazwaPanstwa)!;

      // Dodajemy główne miasto z pytania
      if (item.question) {
        zestawMiast.add(item.question.trim());
      }

      // Dodajemy wszystkie miasta z podpowiedzi (hints)
      if (item.hints && Array.isArray(item.hints)) {
        item.hints.forEach((hint: any) => {
          if (hint.content) {
            zestawMiast.add(hint.content.trim());
          }
        });
      }
    }
  });
}

// Mapujemy całą Twoją wielką tablicę na strukturę bazy Supabase
export const gotoweDaneDoSupabase = DANE_PANSTW.map((item) => {
  const nazwaKraju = item.country.trim();

  const znalezionyUrlFlagi = mapaFlag.get(nazwaKraju) || null;

  if (!znalezionyUrlFlagi) {
    console.warn(`ℹ️ Nie znaleziono dopasowania flagi dla kraju: "${nazwaKraju}"`);
  }

  // Wyciąganie miast (zamieniamy Set z powrotem na zwykłą tablicę Array)
  const zestawMiastDlaKraju = mapaMiast.get(nazwaKraju);
  const tablicaMiast = zestawMiastDlaKraju ? Array.from(zestawMiastDlaKraju) : [];

  if (tablicaMiast.length === 0) {
    console.warn(`ℹ️ Nie znaleziono żadnych miast dla kraju: "${nazwaKraju}"`);
  }

  const tmp = {
    name: nazwaKraju,
    code: pobierzKodISO(nazwaKraju),
    capital: item.capital,
    continent: item.region, // Mapowanie region -> continent
    area_sq_km: item.area, // Mapowanie area -> area_sq_km
    population: item.population,
    borders: item.borders.map((sasiad) => pobierzKodISO(sasiad.trim())),
    flag_url: znalezionyUrlFlagi, // Tutaj wpada link z pliku flag.questions.json
    major_cities: tablicaMiast, // Tablica przygotowana na przyszłość
  };
  return tmp;
});

export function generateCountries() {
  const tmp = gotoweDaneDoSupabase;
  console.log('--- GOTOWY JSON DO SUPABASE ---');
  console.log(JSON.stringify(tmp, null, 2));
  return tmp;
}
