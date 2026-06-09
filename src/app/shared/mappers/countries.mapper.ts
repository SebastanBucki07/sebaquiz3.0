const formatNumber = (num: any): string => {
  const parsed = Number(num);
  if (isNaN(parsed)) return '0';
  return parsed.toLocaleString('pl-PL').replace(/\s/g, ' ');
};

const getCountryName = (code: string, allCountries: any[]) => {
  const country = allCountries.find(c => c.code === code || c.alpha3Code === code);
  return country ? country.name : code;
};

export function mapCountriesToQuestions(countries: any[], allCountries: any[]) {
  return countries.map((c, index) => ({
    id: index,
    question: "Jaki to kraj?",
    answers: [{ label: 'odpowiedz', value: c.name || 'Nieznany' }],
    hints: [
      {
        id: '0',
        label: 'Powierzchnia',
        content: `${formatNumber(c.area_sq_km)} km²`,
        penaltyPercent: 0,
      },
      {
        id: '1',
        label: 'Populacja',
        content: formatNumber(c.area_sq_km),
        penaltyPercent: 0,
      },
      {
        id: '2',
        label: 'Granice',
        content: (c.borders && c.borders.length > 0)
          ? c.borders.map((code: string) => getCountryName(code, allCountries)).join(', ')
          : 'Brak (państwo wyspiarskie)',
        penaltyPercent: 0,
      },
      {
        id: '3',
        label: 'Region',
        content: c.continent || c.subregion || 'Brak danych',
        penaltyPercent: 0
      },
      {id: 'capital_hint', label: 'Stolica', content: c.capital || 'Brak', penaltyPercent: 80},
    ],
  }));
}
