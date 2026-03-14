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
  const tmp = data.map((item) => {
    // Ulepszony Regex:
    // 1. Szuka 'v=' lub 'be/' lub 'embed/'
    // 2. Przechwytuje wszystkie znaki, które NIE SĄ ampersandem (&), pytajnikiem (?) ani ukośnikiem (/)
    const videoIdMatch = item.url.match(/(?:v=|\/embed\/|be\/|v\/)([^&?#/]+)/);
    const videoId = videoIdMatch?.[1] ?? '';

    return {
      id: item.id,
      answers: [
        {
          label: 'Serial',
          value: item.title,
        },
      ],
      question: videoId,
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
    title: 'ach ten Andy',
    author: '-',
    url: 'https://www.youtube.com/watch?v=KGcbejA80ao',
  },
  {
    id: 2,
    title: 'scooby doo',
    author: '-',
    url: 'https://www.youtube.com/watch?v=stLZke_BJow',
  },
  {
    id: 3,
    title: 'muminki',
    author: '-',
    url: 'https://www.youtube.com/watch?v=stLZke_BJow',
  },
  {
    id: 4,
    title: 'atomówki',
    author: '-',
    url: 'https://www.youtube.com/watch?v=hXyCk6RbwWA',
  },
  {
    id: 5,
    title: 'pokemon',
    author: '-',
    url: 'https://www.youtube.com/watch?v=6xKWiCMKKJg',
  },
  {
    id: 6,
    title: 'digimony',
    author: '-',
    url: 'https://www.youtube.com/watch?v=SC7P6QwDg6c',
  },
  {
    id: 7,
    title: 'chojrak tchórzliwy pies',
    author: '-',
    url: 'https://www.youtube.com/watch?v=XarIx317hKI',
  },
  {
    id: 8,
    title: 'świat według ludwiczka',
    author: '-',
    url: 'https://www.youtube.com/watch?v=p6sl6p8dXK0',
  },
  {
    id: 9,
    title: 'sąsiedzi',
    author: '-',
    url: 'https://www.youtube.com/watch?v=rcXWDDYFFS0',
  },
  {
    id: 10,
    title: 'X-men',
    author: '-',
    url: 'https://www.youtube.com/watch?v=sAkL2-vh2Sk',
  },
  {
    id: 11,
    title: 'Ben 10',
    author: '-',
    url: 'https://www.youtube.com/watch?v=_iIUGEOreiw',
  },
  {
    id: 12,
    title: 'Wojownicze żółwie ninja',
    author: '-',
    url: 'https://www.youtube.com/watch?v=FiDGtQFyJ58',
  },
  {
    id: 13,
    title: 'kaczor donald',
    author: '-',
    url: 'https://www.youtube.com/watch?v=EpuGwbzdBpA',
  },
  {
    id: 14,
    title: 'teletubisie',
    author: '-',
    url: 'https://www.youtube.com/watch?v=5ZCgbGgA-_8',
  },
  {
    id: 15,
    title: 'gumisie',
    author: '-',
    url: 'https://www.youtube.com/watch?v=hMmKGCKQgNo',
  },
  {
    id: 16,
    title: 'dragonball',
    author: '-',
    url: 'https://www.youtube.com/watch?v=L2NSoW6hKR0',
  },
  {
    id: 17,
    title: 'smerfy',
    author: '-',
    url: 'https://www.youtube.com/watch?v=XWsX7TgDeoU',
  },
  {
    id: 18,
    title: 'kubuś puchatek',
    author: '-',
    url: 'https://www.youtube.com/watch?v=xc-eU8JokU0',
  },
  {
    id: 19,
    title: 'bolek i lolek',
    author: '-',
    url: 'https://www.youtube.com/watch?v=Nd0TMAFeTHw',
  },
  {
    id: 20,
    title: 'ed edd eddy',
    author: '-',
    url: 'https://www.youtube.com/watch?v=btzLx0Thjw4',
  },
  {
    id: 21,
    title: 'odlotowe agentki',
    author: '-',
    url: 'https://www.youtube.com/watch?v=mOqq0Yj2sKo',
  },
  {
    id: 22,
    title: 'tabaluga',
    author: '-',
    url: 'https://www.youtube.com/watch?v=N3DMEZQdjuQ',
  },
  {
    id: 23,
    title: 'naruto',
    author: '-',
    url: 'https://www.youtube.com/watch?v=hF93UyTJ8p4&list=PLBEQsLTjkBxb1GmXNArwGuAsU7KJ6kBmK',
  },
  {
    id: 24,
    title: 'listonosz pat',
    author: '-',
    url: 'https://www.youtube.com/watch?v=wBN1JBrMJx0&list=PL-svYu08R94vr5_OB9gmclVDRaP_Z8bV1&index=3',
  },
  {
    id: 25,
    title: 'bob budowniczy',
    author: '-',
    url: 'https://www.youtube.com/watch?v=2QrQkcuhAQA&list=PL-svYu08R94vr5_OB9gmclVDRaP_Z8bV1&index=5',
  },
  {
    id: 26,
    title: 'Kulfon',
    author: '-',
    url: 'https://www.youtube.com/watch?v=_4reuXDPyss&list=PL-svYu08R94vr5_OB9gmclVDRaP_Z8bV1&index=4',
  },
  {
    id: 27,
    title: 'krecik',
    author: '-',
    url: 'https://www.youtube.com/watch?v=ucCiiVwtVgQ',
  },
  {
    id: 28,
    title: 'power rangers',
    author: '-',
    url: 'https://www.youtube.com/watch?v=nHalaFUqnTI',
  },
  {
    id: 29,
    title: 'yu gi oh',
    author: '-',
    url: 'https://www.youtube.com/watch?v=WHUcHw7j2Mc',
  },
  {
    id: 30,
    title: 'spiderman',
    author: '-',
    url: 'https://www.youtube.com/watch?v=DZGN9fZvQhc',
  },
  {
    id: 31,
    title: 'power rangers Ninja storm',
    author: '-',
    url: 'https://www.youtube.com/watch?v=1lAfW7VVsqI',
  },
  {
    id: 32,
    title: 'power rangers Time Force',
    author: '-',
    url: 'https://www.youtube.com/watch?v=OBNuPyjUU3o',
  },
  {
    id: 33,
    title: 'Power Rangers Dino Grzmot""',
    author: '-',
    url: 'https://www.youtube.com/watch?v=JT7DzsH0Y38',
  },
  {
    id: 34,
    title: 'Power Rangers SPD',
    author: '-',
    url: 'https://www.youtube.com/watch?v=D188-i5pqTs',
  },
  {
    id: 35,
    title: 'Power Rangers Dino Charge',
    author: '-',
    url: 'https://www.youtube.com/watch?v=5UFi8uRMRSs&list=PLntJcEehxZxEc2YK4Aa-tClTpZGPU5jjw&index=25',
  },
  {
    id: 36,
    title: 'Power Rangers RPM',
    author: '-',
    url: 'https://www.youtube.com/watch?v=XfECxCEOaQs&list=PLntJcEehxZxEc2YK4Aa-tClTpZGPU5jjw&index=19',
  },
  {
    id: 37,
    title: 'Power Rangers Furia dżungli',
    author: '-',
    url: 'https://www.youtube.com/watch?v=YdTBhFw3h9U&list=PLntJcEehxZxEc2YK4Aa-tClTpZGPU5jjw&index=18',
  },
  {
    id: 38,
    title: 'Power Rangers Operacja Overdrive',
    author: '-',
    url: 'https://www.youtube.com/watch?v=9YdHfftUqg4&list=PLntJcEehxZxEc2YK4Aa-tClTpZGPU5jjw&index=17',
  },
  {
    id: 39,
    title: 'Nowe przygody rodziny Addamsów',
    author: '-',
    url: 'https://www.youtube.com/watch?v=BOjXw_uVUyc&list=PLYaF1mNJcMhw6eeUJGgRmctfYAKI2qqwh&index=14',
  },
  {
    id: 40,
    title: 'Denis rozrabiaka',
    author: '-',
    url: 'https://www.youtube.com/watch?v=nbYMnrIHSUs&list=PLYaF1mNJcMhw6eeUJGgRmctfYAKI2qqwh&index=11',
  },
  {
    id: 41,
    title: 'Inspector Gadget',
    author: '-',
    url: 'https://www.youtube.com/watch?v=-DeD3lQHwy0&list=PLYaF1mNJcMhw6eeUJGgRmctfYAKI2qqwh&index=10',
  },
  {
    id: 42,
    title: 'Kleszcz',
    author: '-',
    url: 'https://www.youtube.com/watch?v=u1kQK0HDzVY&list=PLYaF1mNJcMhw6eeUJGgRmctfYAKI2qqwh&index=8',
  },
  {
    id: 43,
    title: 'Szalony Jack pirat',
    author: '-',
    url: 'https://www.youtube.com/watch?v=SrAT27OdJYc&list=PLYaF1mNJcMhw6eeUJGgRmctfYAKI2qqwh&index=13',
  },
  {
    id: 44,
    title: 'Water Melon',
    author: '-',
    url: 'https://www.youtube.com/watch?v=YSWoti19ojU&list=PLYaF1mNJcMhw6eeUJGgRmctfYAKI2qqwh&index=16',
  },
  {
    id: 45,
    title: 'Oggy i karaluchy',
    author: '-',
    url: 'https://www.youtube.com/watch?v=NcqaTTeHeVw&list=PLYaF1mNJcMhw6eeUJGgRmctfYAKI2qqwh&index=19',
  },
  {
    id: 46,
    title: 'Oggy i karaluchy',
    author: '-',
    url: 'https://www.youtube.com/watch?v=cVSENId82Wc&list=PLYaF1mNJcMhw6eeUJGgRmctfYAKI2qqwh&index=20',
  },
  {
    id: 47,
    title: 'The kids from room 402',
    author: '-',
    url: 'https://www.youtube.com/watch?v=7L3ZACjK3tI&list=PLYaF1mNJcMhw6eeUJGgRmctfYAKI2qqwh&index=22',
  },
  {
    id: 49,
    title: 'nie ma to jak hotel',
    author: '-',
    url: 'https://www.youtube.com/watch?v=kRteE5qwDkE&list=RDkRteE5qwDkE&start_radio=1',
  },
  {
    id: 49,
    title: 'Król szamanów',
    author: '-',
    url: 'https://www.youtube.com/watch?v=kRteE5qwDkE&list=RDkRteE5qwDkE&start_radio=1',
  },
  {
    id: 50,
    title: 'Beyblade',
    author: '-',
    url: 'https://www.youtube.com/watch?v=19qpqjebafg',
  },
];

export const musicData = convertMusicToQuiz(inputData);
