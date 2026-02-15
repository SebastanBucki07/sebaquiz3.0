import {Category} from './category.interface';

export const CATEGORY_LIST: Category[] = [
  {
    id: 1,
    type: 'music',
    name: 'Jaka to Melodia?',
    basePoints: 6,
    hints: []
  },
  {
    id: 2,
    type: 'one-answer',
    name: 'Symbole Chemiczne',
    basePoints: 5,
    hints: []
  },
  {
    id: 3,
    type: 'abcd',
    name: 'Wiedza ogólna',
    basePoints: 99,
    hints: []
  },
  {
    id: 4,
    type: 'wpisywanie',
    name: 'Wypisz wspólne',
    basePoints: 99,
    hints: []
  },
  {
    id: 5,
    type: 'music',
    name: 'Czołówki seriali',
    basePoints: 4,
    hints: []
  },
  {
    id: 6,
    type: 'one-answer',
    name: 'Film',
    basePoints: 3,
    hints: []
  },
  {
    id: 7,
    type: 'one-answer',
    name: 'Seriale',
    basePoints: 3,
    hints: []
  },
  {
    id: 8,
    type: 'photos',
    name: 'Budowle',
    basePoints: 99,
    hints: []
  }, {
    id: 9,
    type: 'photos',
    name: 'Znane postacie',
    basePoints: 4,
    hints: []
  },
  {
    id: 10,
    type: 'one-answer',
    name: 'Gry',
    basePoints: 3,
    hints: []
  },
  {
    id: 11,
    type: 'one-answer',
    name: 'Biologia',
    basePoints: 5,
    hints: []
  },
  {
    id: 12,
    type: 'one-answer',
    name: 'Bogowie',
    basePoints: 3,
    hints: []
  },
  {
    id: 13,
    type: 'one-answer',
    name: 'Historia',
    basePoints: 5,
    hints: []
  },
  {
    id: 14,
    type: 'one-answer',
    name: 'Miasto - Województwo',
    basePoints: 5,
    hints: []
  },
  {
    id: 15,
    type: 'one-answer',
    name: 'Nazwy stadionów',
    basePoints:3,
    hints: []
  },
  {
    id: 16,
    type: 'one-answer',
    name: 'Piłka nożna - wielkie imprezy',
    basePoints: 2,
    hints: []
  },
  {
    id: 17,
    type: 'one-answer',
    name: 'Przysłowia',
    basePoints: 3,
    hints: []
  },
  {
    id: 18,
    type: 'music',
    name: 'Piosenki mistrzostw',
    basePoints: 3,
    hints: []
  },
  {
    id: 19,
    type: 'hints',
    name: 'Lektury',
    basePoints: 10,
    hints: [
      {
        id: 'first',
        label: 'Pierwszy fragment',
        penaltyPercent: 0,
        content: 'Śród takich pól przed laty, nad brzegiem ruczaju6, Na pagórku niewielkim, we brzozowym gaju, Stał dwór szlachecki, z drzewa, lecz podmurowany;  Świeciły się z daleka pobielane ściany,"'
      },
      {id: 'second', label: 'Drugi fragment', penaltyPercent: 30, content: 'Film został wydany w 1999 roku.'},
      {id: 'third', label: 'Trzeci fragment', penaltyPercent: 30, content: 'Główną rolę grał Brad Pitt.'}
    ]
  },
  {
    id: 20,
    type: 'hints',
    name: 'Miasta świata',
    basePoints: 6,
    hints: [
      {
        id: 'first',
        label: 'Pierwsze miasto',
        penaltyPercent: 0,
        content: 'Kraków'
      },
      {id: 'second', label: 'Drugie miasto', penaltyPercent: 20, content: 'Katowice'},
      {id: 'third', label: 'Trzecie miasto', penaltyPercent: 20, content: 'Gdańsk'}
    ]
  },
  {
    id: 21,
    type: 'hints',
    name: 'Artysta po tytułach piosenek',
    basePoints: 10,
    hints: [
      {
        id: 'first',
        label: 'Pierwszy tytuł',
        penaltyPercent: 0,
        content: 'Papa Don\'t Preach'
      },
      {id: 'second', label: 'Drugi tytuł', penaltyPercent: 20, content: 'Frozen'},
      {id: 'third', label: 'Trzeci tytuł', penaltyPercent: 20, content: 'Hung Up'}
    ]
  },
  {
    id: 22,
    type: 'hints',
    name: 'Fragmenty piosenek',
    basePoints: 10,
    hints: [
      {
        id: 'first',
        label: 'Pierwszy fragment',
        penaltyPercent: 0,
        content: "Słyszę falę braw\nA w głowie ciszę mam",
      },
      {
        id: 'second',
        label: 'Drugi fragment',
        penaltyPercent: 30,
        content: "Jak mnie zapamiętasz Czy zostanie po mnie ślad?",
      },
      {
        id: 'third',
        label: 'Trzeci fragment',
        penaltyPercent: 30,
        content: "Może znałeś człowieka\nMoże słyszałeś jak gra"
      }
    ]
  },
  {
    id: 23,
    type: 'writting-category',
    name: 'Stolice na literę',
    basePoints: 5,
    hints: []
  },
  {
    id: 24,
    type: 'writting-category',
    name: 'Państwa na literę',
    basePoints: 5,
    hints: []
  },
  {
    id: 25,
    type: 'writting-category',
    name: 'Państwa z kontynentu',
    basePoints: 5,
    hints: []
  },
  {
    id: 26,
    type: 'writting-category',
    name: 'Stolice z kontynentu',
    basePoints: 5,
    hints: []
  },
  {
    id: 27,
    type: 'photos',
    name: 'Flagi',
    basePoints: 5,
    hints: []
  },
  {
    id: 28,
    type: 'one-answer',
    name: 'Stolice krajów',
    basePoints: 4,
    hints: []
  },
  {
    id: 29,
    type: 'hints',
    name: 'Reżyser po filmach',
    basePoints: 10,
    hints: [
      {id: 'first', label: 'Pierwszy film', penaltyPercent: 0, content: 'Rezyser 1'},
      {id: 'second', label: 'Drugi film', penaltyPercent: 20, content: 'Film został wydany w 1999 roku.'},
      {id: 'third', label: 'Trzeci film', penaltyPercent: 30, content: 'Główną rolę grał Brad Pitt.'}
    ]
  },
  {
    id: 30,
    type: 'hints',
    name: 'Film po bohaterach',
    basePoints: 6,
    hints: [
      {id: 'first', label: 'Pierwszy film', penaltyPercent: 0, content: 'Rezyser 1'},
      {id: 'second', label: 'Drugi film', penaltyPercent: 0, content: 'Film został wydany w 1999 roku.'},
      {id: 'third', label: 'Trzeci film', penaltyPercent: 0, content: 'Główną rolę grał Brad Pitt.'}
    ]
  },
  {
    id: 31,
    type: 'hints',
    name: 'Serial po bohaterach',
    basePoints: 6,
    hints: [
      {id: 'first', label: 'Pierwszy film', penaltyPercent: 0, content: 'Rezyser 1'},
      {id: 'second', label: 'Drugi film', penaltyPercent: 0, content: 'Film został wydany w 1999 roku.'},
      {id: 'third', label: 'Trzeci film', penaltyPercent: 0, content: 'Główną rolę grał Brad Pitt.'}
    ]
  },
  {
    id: 32,
    type: 'photo-fragments',
    name: 'Jakie to logo?',
    basePoints: 6,
    hints: [
      {id: 'first', label: 'Pierwszy fragment', penaltyPercent: 0, content: 'Rezyser 1'},
      {id: 'second', label: 'Drugi fragment', penaltyPercent: 30, content: 'Film został wydany w 1999 roku.'},
      {id: 'third', label: 'Trzeci fragment', penaltyPercent: 30, content: 'Główną rolę grał Brad Pitt.'}
    ]
  },
  {
    id: 33,
    type: 'photo-fragments',
    name: 'Jaki to herb piłkarski?',
    basePoints: 6,
    hints: [
      {id: 'first', label: 'Pierwszy fragment', penaltyPercent: 0, content: 'Rezyser 1'},
      {id: 'second', label: 'Drugi fragment', penaltyPercent: 30, content: 'Film został wydany w 1999 roku.'},
      {id: 'third', label: 'Trzeci fragment', penaltyPercent: 30, content: 'Główną rolę grał Brad Pitt.'}
    ]
  },
  {
    id: 34,
    type: 'writting-category',
    name: 'Wypisywanie róznych wspólnych',
    basePoints: 5,
    hints: []
  },
  {
    id: 35,
    type: 'writting-category',
    name: 'Wypisywanie róznych wspólnych - piłka nożna',
    basePoints: 5,
    hints: []
  },
  {
    id: 36,
    type: 'photo-hints',
    name: 'Klubowa Historia piłkarza',
    basePoints: 5,
    hints: []
  },
  {
    id: 37,
    type: 'photo-hints',
    name: 'W jakim filmie zagrała taka obsada?',
    basePoints: 5,
    hints: []
  },
  {
    id: 38,
    type: 'photo-hints',
    name: 'W jakim serialu zagrała taka obsada?',
    basePoints: 5,
    hints: []
  },
  {
    id: 39,
    type: 'familiada',
    name: 'Familiada',
    basePoints: 5,
    hints: []
  },
  {
    id: 40,
    type: 'footballGame',
    name: 'Był taki mecz',
    basePoints: 5,
    hints: []
  },
  {
    id: 41,
    type: 'ticTacToe',
    name: 'Piłkarskie kółko i krzyżyk',
    basePoints: 5,
    hints: []
  },
  {
    id: 42,
    type: 'ticTacToe',
    name: 'Aktorskie kółko i krzyżyk',
    basePoints: 5,
    hints: []
  },
  {
    id: 33,
    type: 'photo-fragments',
    name: 'Fragmenty Flag',
    basePoints: 6,
    hints: [
      {id: 'first', label: 'Pierwszy fragment', penaltyPercent: 0, content: 'Rezyser 1'},
      {id: 'second', label: 'Drugi fragment', penaltyPercent: 30, content: 'Film został wydany w 1999 roku.'},
      {id: 'third', label: 'Trzeci fragment', penaltyPercent: 30, content: 'Główną rolę grał Brad Pitt.'}
    ]
  },
];
