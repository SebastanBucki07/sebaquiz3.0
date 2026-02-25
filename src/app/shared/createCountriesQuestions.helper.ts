interface RestCountry {
  name: {
    common: string;
  };
  translations?: {
    pol?: {
      common: string;
    };
  };
  cca3: string;
  capital?: string[];
  region: string;
  subregion?: string;
  borders?: string[];
  area: number;
  population: number;
}

interface TransformedCountry {
  country: string;
  capital: string | null;
  region: string;
  borders: string[];
  area: number;
  population: number;
}

export function transformCountries(countries: RestCountry[]): TransformedCountry[] {
  // mapa kodu kraju (cca3) → polska nazwa
  const codeToPolishName: Record<string, string> = {};

  countries.forEach((country) => {
    codeToPolishName[country.cca3] = country.translations?.pol?.common ?? country.name.common;
  });

  function mapRegion(region: string, subregion?: string): string {
    if (region === 'Americas') {
      if (subregion === 'North America') return 'Ameryka Północna';
      if (subregion === 'Central America') return 'Ameryka Środkowa';
      if (subregion === 'South America') return 'Ameryka Południowa';
    }

    switch (region) {
      case 'Europe':
        return 'Europa';
      case 'Asia':
        return 'Azja';
      case 'Africa':
        return 'Afryka';
      case 'Oceania':
        return 'Oceania';
      default:
        return region;
    }
  }

  return countries.map(
    (country): TransformedCountry => ({
      country: country.translations?.pol?.common ?? country.name.common,
      capital: country.capital?.[0] ?? null,
      region: mapRegion(country.region, country.subregion),
      borders: (country.borders ?? []).map((code) => codeToPolishName[code] ?? code),
      area: country.area,
      population: country.population,
    })
  );
}

async function getCountries(): Promise<TransformedCountry[]> {
  const response = await fetch(
    'https://restcountries.com/v3.1/all?fields=name,translations,cca3,capital,region,subregion,borders,area,population'
  );

  if (!response.ok) {
    throw new Error('Błąd pobierania danych');
  }

  const data: RestCountry[] = await response.json();

  const tmp = transformCountries(data);

  console.log(JSON.stringify(tmp));
  return tmp;
}

export const dataCountry = getCountries();
