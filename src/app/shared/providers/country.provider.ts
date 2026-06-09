import {DANE_PANSTW} from '../questions/countries.questions';
import {CountryQuestion, TransformedCountry} from '../questionCountriesClass.helper';
import {Question} from '../questions/question.interface';

export class CountryProvider {
  private static _countries: any[] = DANE_PANSTW;
  private static instance = new CountryQuestion(CountryProvider.transformData(DANE_PANSTW));

  private static transformData(data: any[]): TransformedCountry[] {
    return data.map(item => ({
      code: item.code || '',
      country: item.name || item.country || 'Unknown',
      capital: item.capital || 'Brak',
      region: item.continent || 'Unknown',
      borders: item.borders || [],
      area: item.area_sq_km || 0,
      population: item.population || 0,
      majorCities: item.major_cities || [],
      flag_url: item.flag_url || ''
    }));
  }

  static set countries(newData: any[]) {
    if (newData && newData.length > 0) {
      this._countries = newData;
      this.instance = new CountryQuestion(this.transformData(newData));
    }
  }

  static get countries(): any[] {
    return this._countries;
  }

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

  static getMajorCities(): Question[] {
    return this.instance.getMajorCitiesQuestions();
  }

  static getFlags(): Question[] {
    return this.instance.getFlagQuestions();
  }

  static getFlagFragments(): Question[] {
    return this.instance.getFlagFragmentQuestions();
  }
}
