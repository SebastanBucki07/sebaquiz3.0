import {Category} from './category.interface';

export const CATEGORY_LIST: Category[] = [
  {
    id: 0,
    name: 'Filmy',
    basePoints: 10,
    hints: [
      {id: 'director', label: 'Rezyser', penaltyPercent: 0, content: 'Reyzser 1 '},
      {id: 'year', label: 'Rok produkcji', penaltyPercent: 20, content: 'Film został wydany w 1999 roku.'},
      {id: 'actor', label: 'Aktor', penaltyPercent: 30, content: 'Główną rolę grał Brad Pitt.'}
    ]
  },
  {
    id: 1,
    name: 'Muzyka',
    basePoints: 5,
    hints: []
  },
  {
    id: 2, name: 'Geografia', basePoints: 2,
    hints: []
  },
  {
    id: 3, name: 'Historia', basePoints: 2,
    hints: []
  },
  {
    id: 4, name: 'Biologia', basePoints: 2,
    hints: []
  },
  {
    id: 5, name: 'Matematyka', basePoints: 2,
    hints: []
  },
  {
    id: 6, name: 'Fizyka', basePoints: 2,
    hints: []
  },
  {
    id: 7, name: 'Literatura', basePoints: 2,
    hints: []
  },
  {
    id: 8, name: 'Chemia', basePoints: 2,
    hints: []
  },
  {
    id: 9, name: 'Sztuka', basePoints: 2,
    hints: []
  }
];
