interface CountryInput {
  id: number;
  name: string;
  continent: string;
  capital: string;
  surface: number;
  population: number;
  code: string;
  display?: boolean;
  borders: string[];
}

interface OutputItem {
  id: number;
  answers: { value: string }[];
  question: string;
  hints: {
    id: string;
    label: string;
    content: string | string[];
    penaltyPercent: number;
  }[];
  revealedAnswers: any[];
}

function transformCountriesToPhotoQuiz(data: CountryInput[]): OutputItem[] {
  const result = data.map((item) => ({
    id: item.id,

    answers: [{ value: item.name.trim() }],

    question: `https://flagcdn.com/w80/${item.code.toLowerCase()}.png`,

    hints: [
      {
        id: '0',
        label: 'Kontynent',
        content: item.continent,
        penaltyPercent: 0,
      },
      {
        id: '1',
        label: 'Kod kraju',
        content: item.code,
        penaltyPercent: 20,
      },
      {
        id: '2',
        label: 'Stolica',
        content: item.capital,
        penaltyPercent: 20,
      },
      {
        id: '3',
        label: 'Państwa graniczące',
        content: item.borders,
        penaltyPercent: 20,
      },
    ],

    revealedAnswers: [],
  }));

  console.log(JSON.stringify(result, null, 2));
  return result;
}

const input: CountryInput[] = [
  {
    id: 1,
    name: 'Andorra',
    continent: 'Europe',
    capital: 'Andorra la Vella',
    surface: 468,
    population: 88406,
    code: 'AD',
    display: false,
    borders: ['France', 'Spain'],
  },
  {
    id: 2,
    name: 'Trinidad and Tobago',
    continent: 'Americas',
    capital: 'Port of Spain',
    surface: 5130,
    population: 1367764,
    code: 'TT',
    display: false,
    borders: [],
  },
];

export const flagData = transformCountriesToPhotoQuiz(input);
