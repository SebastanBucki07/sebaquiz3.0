import { Question } from './questions/question.interface';
import {getCountryName} from './mappers/countries.mapper';

export interface TransformedCountry {
  code: string;
  country: string;
  capital: string | null;
  region: string; // np. "Europa", "Azja"
  borders: string[];
  area: number;
  population: number;
  flag_url: string;
  majorCities: string[];
}

export class CountryQuestion {
  constructor(private countries: TransformedCountry[]) {}


  getCapitalsByContinent(continent: string, id: number): Question | null {
    const answers = this.countries
    .filter((c) => c.region.toLowerCase() === continent.toLowerCase())
    .map((c) => c.capital)
    .filter((capital): capital is string => capital !== null)
    .sort((a, b) => a.localeCompare(b))
    .map((capital) => ({ value: capital, correct: false }));

    if (answers.length <= 3) return null;

    return {
      id,
      question: `Stolice - ${continent}`,
      answers,
      hints: [],
      revealedAnswers: [],
      showAnswer: false,
    };
  }

  getCountriesByContinent(continent: string, id: number): Question | null {
    const answers = this.countries
    .filter((c) => c.region.toLowerCase() === continent.toLowerCase())
    .sort((a, b) => a.country.localeCompare(b.country))
    .map((c) => ({ value: c.country, correct: false }));

    if (answers.length <= 3) return null;

    return {
      id,
      question: `Państwa z ${continent}`,
      answers,
      hints: [],
      revealedAnswers: [],
      showAnswer: false,
    };
  }

  getCapitalsByLetter(letter: string, id: number): Question | null {
    const normalizedLetter = letter.toLowerCase();

    const answers = this.countries
    .map((c) => c.capital)
    .filter((capital): capital is string => capital !== null)
    .filter((capital) => capital.toLowerCase().startsWith(normalizedLetter))
    .sort((a, b) => a.localeCompare(b))
    .map((capital) => ({ value: capital, correct: false }));

    if (answers.length <= 3) return null;

    return {
      id,
      question: `Stolice na literę "${letter.toUpperCase()}"`,
      answers,
      hints: [],
      revealedAnswers: [],
      showAnswer: false,
    };
  }

  getCountriesByLetter(letter: string, id: number): Question | null {
    const normalizedLetter = letter.toLowerCase();

    const answers = this.countries
    .filter((c) => c.country.toLowerCase().startsWith(normalizedLetter))
    .sort((a, b) => a.country.localeCompare(b.country))
    .map((c) => ({ value: c.country, correct: false }));

    if (answers.length <= 3) return null;

    return {
      id,
      question: `Państwa na literę "${letter.toUpperCase()}"`,
      answers,
      hints: [],
      revealedAnswers: [],
      showAnswer: false,
    };
  }

  getMajorCitiesQuestions(startingId: number = 600): Question[] {
    return this.countries
    .filter((c) => c.majorCities && c.majorCities.length >= 3)
    .map((country, index) => ({
      id: startingId + index,
      question: `Jakie to państwo? (Miasta: ${country.majorCities.slice(0, 3).join(', ')})`,
      answers: [{ label: 'Państwo', value: country.country }],
      hints: [
        { id: '0', label: 'Miasto 1', content: country.majorCities[0], penaltyPercent: 0 },
        { id: '1', label: 'Miasto 2', content: country.majorCities[1], penaltyPercent: 20 },
        { id: '2', label: 'Miasto 3', content: country.majorCities[2], penaltyPercent: 40 }
      ],
      revealedAnswers: [],
      showAnswer: false
    }));
  }

  getCountriesByAllContinents(startingId: number = 100): Question[] {
    const continents = Array.from(new Set(this.countries.map((c) => c.region)));

    return continents
    .map((continent, index) => this.getCountriesByContinent(continent, startingId + index))
    .filter((q): q is Question => q !== null);
  }

  getCapitalsByAllContinents(startingId: number = 100): Question[] {
    const continents = Array.from(new Set(this.countries.map((c) => c.region)));

    return continents
    .map((continent, index) => this.getCapitalsByContinent(continent, startingId + index))
    .filter((q): q is Question => q !== null);
  }

  getCapitalsByAllLetters(startingId: number = 400): Question[] {
    const letters = Array.from(
      new Set(
        this.countries
        .map((c) => c.capital)
        .filter((capital): capital is string => capital !== null)
        .map((capital) => capital.charAt(0).toUpperCase())
      )
    ).sort((a, b) => a.localeCompare(b));

    return letters
    .map((letter, index) => this.getCapitalsByLetter(letter, startingId + index))
    .filter((q): q is Question => q !== null);
  }

  getCountriesByAllLetters(startingId: number = 300): Question[] {
    const letters = Array.from(
      new Set(this.countries.map((c) => c.country.charAt(0).toUpperCase()))
    ).sort((a, b) => a.localeCompare(b));

    return letters
    .map((letter, index) => this.getCountriesByLetter(letter, startingId + index))
    .filter((q): q is Question => q !== null);
  }

  getCountryCapitalQuestions(startingId: number = 500): Question[] {
    return this.countries
    .filter((c) => c.capital !== null)
    .sort((a, b) => a.country.localeCompare(b.country))
    .map((country, index) => ({
      id: startingId + index,
      question: `Jaka jest stolica kraju: ${country.country}?`,
      answers: [{ value: country.capital as string, correct: true }],
      hints: [],
      revealedAnswers: [],
      showAnswer: false,
    }));
  }

  getFlagQuestions(startingId: number = 700): Question[] {
    return this.countries
    .filter((c) => c.flag_url)
    .map((c, index) => {
      // Przygotowanie granic z mapowaniem
      const bordersDisplay = (c.borders && c.borders.length > 0)
        ? c.borders.map(code => getCountryName(code, this.countries)).join(', ')
        : 'Brak (państwo wyspiarskie)';

      return {
        id: startingId + index,
        question: c.flag_url,
        answers: [{ label: 'odpowiedz', value: c.country }],
        hints: [
          { id: '0', label: 'Kontynent', content: c.region, penaltyPercent: 20 },
          { id: '1', label: 'Stolica', content: c.capital || 'Brak', penaltyPercent: 30 },
          { id: '2', label: 'Granice', content: bordersDisplay, penaltyPercent: 20 }
        ],
        revealedAnswers: [],
        showAnswer: false,
      };
    });
  }

  getFlagFragmentQuestions(startingId: number = 800): Question[] {
    return this.countries
    .filter(c => c.flag_url)
    .map((c, index) => ({
      id: startingId + index,
      // URL flagi zostaje w "question" – to główny identyfikator obrazka dla komponentu
      question: c.flag_url,
      answers: [{ label: 'odpowiedz', value: c.country }],
      hints: [
        {
          id: 'frag_1',
          label: 'Odsłoń pierwsze fragmenty',
          content: "10", // Zostawiamy tak, jak wymaga tego Twój komponent
          penaltyPercent: 0
        },
        {
          id: 'frag_2',
          label: 'Odsłoń kolejne fragmenty',
          content: "10",
          penaltyPercent: 30
        },
        {
          id: 'frag_3',
          label: 'Odsłoń kolejne fragmenty',
          content: "20",
          penaltyPercent: 30
        }
      ],
      revealedAnswers: [],
      showAnswer: false,
    }));
  }
}
