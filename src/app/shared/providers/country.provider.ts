import { DANE_PANSTW } from '../questions/countries.questions';
import { CountryQuestion } from '../questionCountriesClass.helper';
import { Question } from '../questions/question.interface';

export class CountryProvider {
  private static instance = new CountryQuestion(DANE_PANSTW);

  static getCapitals(): Question[] {
    return this.instance.getCountryCapitalQuestions();
  }

  static getCountriesByContinent(): Question[] {
    return this.instance.getCountriesByAllContinents();
  }

  static getCapitalsByContinent(): Question[] {
    return this.instance.getCapitalsByAllContinents();
  }

  static getCountriesByLetter(): Question[] {
    return this.instance.getCountriesByAllLetters();
  }

  static getCapitalsByLetter(): Question[] {
    return this.instance.getCapitalsByAllLetters();
  }
}
