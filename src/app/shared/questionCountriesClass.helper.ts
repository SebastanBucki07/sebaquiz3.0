import { Question } from './questions/question.interface';

interface TransformedCountry {
  country: string;
  capital: string | null;
  region: string; // np. "Europa", "Azja"
  borders: string[];
  area: number;
  population: number;
}

export class CountryQuestion {
  constructor(private countries: TransformedCountry[]) {}

  // Zmieniamy typ zwracany na Question | null
  getCapitalsByContinent(continent: string, id: number): Question | null {
    const answers = this.countries
    .filter((c) => c.region.toLowerCase() === continent.toLowerCase())
    .map((c) => c.capital)
    .filter((capital): capital is string => capital !== null)
    .sort((a, b) => a.localeCompare(b))
    .map((capital) => ({ value: capital }));

    // 🔥 Warunek: minimum 4 odpowiedzi (więcej niż 3)
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
    .map((c) => ({ value: c.country }));

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
    .map((capital) => ({ value: capital }));

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
    .map((c) => ({ value: c.country }));

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

  // --- METODY GENERUJĄCE LISTY ---
  // Muszą odfiltrować wartości null, aby zwrócić czystą tablicę Question[]

  getCountriesByAllContinents(startingId: number = 100): Question[] {
    const continents = Array.from(new Set(this.countries.map((c) => c.region)));

    return continents
    .map((continent, index) => this.getCountriesByContinent(continent, startingId + index))
    .filter((q): q is Question => q !== null); // Usuwa te, które miały <= 3 odpowiedzi
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

  // W tej metodzie zwykle jest 1 odpowiedź (kraj -> stolica),
  // więc jeśli wymagasz > 3, ta metoda zawsze zwróci pustą tablicę.
  // Zostawiam ją bez zmian lub z filtrem, jeśli intencja była inna.
  getCountryCapitalQuestions(startingId: number = 500): Question[] {
    return this.countries
    .filter((c) => c.capital !== null)
    .sort((a, b) => a.country.localeCompare(b.country))
    .map((country, index) => ({
      id: startingId + index,
      question: `${country.country}`,
      answers: [{ value: country.capital as string }],
      hints: [],
      revealedAnswers: [],
      showAnswer: false,
    }))
    .filter(q => q.answers.length > 3); // To prawdopodobnie wyczyści całą listę
  }
}
