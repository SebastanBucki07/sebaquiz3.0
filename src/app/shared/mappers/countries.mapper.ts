import { Question } from '../questions/question.interface';

export function mapCountriesToQuestions(rawCountries: any[]): Question[] {
  return rawCountries.map((c, index) => ({
    id: index + 1,
    question: 'Co to za kraj?',
    answers: [{ label: 'Kraj', value: c.country }],
    hints: [
      {
        id: '0',
        label: 'Powierzchnia',
        content: `${c.area.toLocaleString('pl-PL').replace(/,/g, ' ')} km²`,
        penaltyPercent: 0,
      },
      {
        id: '1',
        label: 'Populacja',
        content: c.population.toLocaleString('pl-PL').replace(/,/g, ' '),
        penaltyPercent: 0,
      },
      {
        id: '2',
        label: 'Granice',
        content: c.borders?.length > 0 ? c.borders.join(', ') : 'Brak (państwo wyspiarskie)',
        penaltyPercent: 0,
      },
      { id: '3', label: 'Region', content: c.region, penaltyPercent: 0 },
      { id: 'capital_hint', label: 'Stolica', content: c.capital, penaltyPercent: 80 },
    ],
    showAnswer: false,
    revealedAnswers: [],
  }));
}
