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

  getCapitalsByContinent(continent: string, id: number): Question {
    const answers = this.countries
      .filter((c) => c.region.toLowerCase() === continent.toLowerCase())
      .map((c) => c.capital)
      .filter((capital): capital is string => capital !== null) // tylko niepuste
      .sort((a, b) => a.localeCompare(b))
      .map((capital) => ({ value: capital }));

    return {
      id,
      question: `Stolice - ${continent}`,
      answers,
      hints: [],
      revealedAnswers: [],
      showAnswer: false,
    };
  }

  getCountriesByContinent(continent: string, id: number): Question {
    const answers = this.countries
      .filter((c) => c.region.toLowerCase() === continent.toLowerCase())
      .sort((a, b) => a.country.localeCompare(b.country))
      .map((c) => ({ value: c.country }));

    return {
      id,
      question: `Państwa z ${continent}"`,
      answers,
      hints: [],
      revealedAnswers: [],
      showAnswer: false,
    };
  }

  getCountriesByAllContinents(startingId: number = 100): Question[] {
    // unikalne kontynenty
    const continents = Array.from(new Set(this.countries.map((c) => c.region)));

    // generowanie quizu dla każdego kontynentu
    return continents.map((continent, index) =>
      this.getCountriesByContinent(continent, startingId + index)
    );
  }

  getCapitalsByAllContinents(startingId: number = 100): Question[] {
    // unikalne kontynenty
    const continents = Array.from(new Set(this.countries.map((c) => c.region)));

    return continents.map((continent, index) =>
      this.getCapitalsByContinent(continent, startingId + index)
    );
  }

  getCapitalsByLetter(letter: string, id: number): Question {
    const normalizedLetter = letter.toLowerCase();

    const answers = this.countries
      .map((c) => c.capital)
      .filter((capital): capital is string => capital !== null)
      .filter((capital) => capital.toLowerCase().startsWith(normalizedLetter))
      .sort((a, b) => a.localeCompare(b))
      .map((capital) => ({ value: capital }));

    return {
      id,
      question: `Stolice na literę "${letter.toUpperCase()}"`,
      answers,
      hints: [],
      revealedAnswers: [],
      showAnswer: false,
    };
  }

  // 🔥 Stolice dla wszystkich liter (automatycznie)
  getCapitalsByAllLetters(startingId: number = 400): Question[] {
    const letters = Array.from(
      new Set(
        this.countries
          .map((c) => c.capital)
          .filter((capital): capital is string => capital !== null)
          .map((capital) => capital.charAt(0).toUpperCase())
      )
    ).sort((a, b) => a.localeCompare(b));

    return letters.map((letter, index) => this.getCapitalsByLetter(letter, startingId + index));
  }

  // 🔹 Państwa na konkretną literę
  getCountriesByLetter(letter: string, id: number): Question {
    const normalizedLetter = letter.toLowerCase();

    const answers = this.countries
      .filter((c) => c.country.toLowerCase().startsWith(normalizedLetter))
      .sort((a, b) => a.country.localeCompare(b.country))
      .map((c) => ({ value: c.country }));

    return {
      id,
      question: `Państwa na literę "${letter.toUpperCase()}"`,
      answers,
      hints: [],
      revealedAnswers: [],
      showAnswer: false,
    };
  }

  // 🔥 Państwa dla wszystkich liter (automatycznie)
  getCountriesByAllLetters(startingId: number = 300): Question[] {
    // pobieramy unikalne pierwsze litery z istniejących państw
    const letters = Array.from(
      new Set(this.countries.map((c) => c.country.charAt(0).toUpperCase()))
    ).sort((a, b) => a.localeCompare(b));

    return letters.map((letter, index) => this.getCountriesByLetter(letter, startingId + index));
  }

  getCountryCapitalQuestions(startingId: number = 500): Question[] {
    return this.countries
      .filter((c) => c.capital !== null) // tylko kraje ze stolicą
      .sort((a, b) => a.country.localeCompare(b.country))
      .map(
        (country, index): Question => ({
          id: startingId + index,
          question: `${country.country}`,
          answers: [{ value: country.capital as string }],
          hints: [],
          revealedAnswers: [],
          showAnswer: false,
        })
      );
  }
}
