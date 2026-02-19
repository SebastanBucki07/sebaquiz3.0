interface MusicItem {
  id: number;
  title: string;
  author: string;
  url: string;
}

interface Answer {
  label: string;
  value: string;
}

interface Hint {
  id: string;
  label: string;
  content: string;
  penaltyPercent: number;
}

interface QuizItem {
  id: number;
  answers: Answer[];
  question: string;
  hints: Hint[];
  revealedAnswers: string[];
}

function convertMusicToQuiz(data: MusicItem[]): QuizItem[] {
  const tmp = data.map((item, index) => {
    const videoId = item.url.match(/embed\/([^?]+)/)?.[1] ?? '';

    return {
      id: index + 1,
      answers: [
        {
          label: 'Tytuł',
          value: item.title,
        },
        {
          label: 'Autor',
          value: item.author,
        },
      ],
      question: videoId, // albo np. "Jaki to utwór?"
      hints: [],
      revealedAnswers: [],
    };
  });
  console.log(JSON.stringify(tmp, null, 2));
  return tmp;
}

const inputData = [
  {
    id: 1,
    title: 'MŚ Qatar 2022',
    author: '-',
    url: 'https://www.youtube.com/embed/vyDjFVZgJoo',
  },
  {
    id: 2,
    title: 'Euro 2022',
    author: '-',
    url: 'https://www.youtube.com/embed/kGT73GcwhCU',
  },
  {
    id: 3,
    title: 'MŚ ROSJA 2018',
    author: '-',
    url: 'https://www.youtube.com/embed/kFMZUxX6K6o',
  },
  {
    id: 4,
    title: 'MŚ Brazylia 0214',
    author: '-',
    url: 'https://www.youtube.com/embed/TGtWWb9emYI',
  },
  {
    id: 5,
    title: 'MŚ RPA 2010',
    author: '-',
    url: 'https://www.youtube.com/embed/pRpeEdMmmQ0',
  },
  {
    id: 6,
    title: 'MŚ Niemcy 2006',
    author: '-',
    url: 'https://www.youtube.com/embed/cGB83476ZPA',
  },
  {
    id: 7,
    title: 'MŚ 2002 Korea JAponia',
    author: '-',
    url: 'https://www.youtube.com/embed/pcbGxT7nG60',
  },
  {
    id: 8,
    title: 'EURO France 2016',
    author: '-',
    url: 'https://www.youtube.com/embed/MoHnffhBwqs',
  },
  {
    id: 9,
    title: 'Euro Polska - Ukraina 2012',
    author: '-',
    url: 'https://www.youtube.com/embed/5EVhiBGvVFc',
  },
  {
    id: 10,
    title: 'Euro 2008 Austria - Szwajcaria',
    author: '-',
    url: 'https://www.youtube.com/embed/ibvT3tWWpOU',
  },
  {
    id: 11,
    title: 'Euro 2004 Portugalia',
    author: '-',
    url: 'https://www.youtube.com/embed/q58F7k2nLoA',
  },
];

export const musicData = convertMusicToQuiz(inputData);
