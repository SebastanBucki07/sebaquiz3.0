import {Category} from './category.interface';

export const CATEGORY_LIST: Category[] = [
  {
    id: 0,
    type: 'hints',
    name: 'Filmy',
    basePoints: 10,
    hints: [
      {id: 'director', label: 'Rezyser', penaltyPercent: 0, content: 'Rezyser 1'},
      {id: 'year', label: 'Rok produkcji', penaltyPercent: 20, content: 'Film został wydany w 1999 roku.'},
      {id: 'actor', label: 'Aktor', penaltyPercent: 30, content: 'Główną rolę grał Brad Pitt.'}
    ]
  },
  {
    id: 1,
    type: 'music',
    name: 'Muzyka',
    basePoints: 5,
    hints: []
  },
  {
    id: 2,
    type: 'one-answer',
    name: 'Geografia',
    basePoints: 5,
    hints: []
  },
  {
    id: 3,
    type: 'abcd',
    name: 'Wiedza ogólna',
    basePoints: 5,
    hints: []
  },
  {
    id: 4,
    type: 'wpisywanie',
    name: 'Wypisz wspólne',
    basePoints: 5,
    hints: []
  },
  {
    id: 5,
    type: 'music',
    name: 'tvSeries',
    basePoints: 5,
    hints: []
  },
  {
    id: 6,
    type: 'one-answer',
    name: 'Historia',
    basePoints: 5,
    hints: []
  },
  {
    id: 7,
    type: 'one-answer',
    name: 'Sztuka',
    basePoints: 5,
    hints: []
  },
  {
    id: 8,
    type: 'photos',
    name: 'Budowle',
    basePoints: 5,
    hints: []
  },{
    id: 9,
    type: 'photos',
    name: 'Znane osoby',
    basePoints: 5,
    hints: []
  },
];
