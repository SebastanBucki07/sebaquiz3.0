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
    title: 'Polska ',
    author: '-',
    url: 'https://www.youtube.com/watch?v=Gkmt-FBnlWg',
  },
  {
    id: 2,
    title: 'Szkocja',
    author: '-',
    url: 'https://www.youtube.com/watch?v=HeV379qCtX8',
  },
  {
    id: 3,
    title: 'Anglia',
    author: '-',
    url: 'https://www.youtube.com/watch?v=I8KSAtos-dk',
  },
  {
    id: 4,
    title: 'Niemcy',
    author: '-',
    url: 'https://www.youtube.com/watch?v=s-wVIn24brs',
  },
  {
    id: 5,
    title: 'Portugalia',
    author: '-',
    url: 'https://www.youtube.com/watch?v=MkSQ6_XhvjQ',
  },
  {
    id: 6,
    title: 'Szwajcaria',
    author: '-',
    url: 'https://www.youtube.com/watch?v=ZfDpRzN2SBI',
  },
  {
    id: 7,
    title: 'Walia',
    author: '-',
    url: 'https://www.youtube.com/watch?v=ZwdZOHm8r-Y',
  },
  {
    id: 8,
    title: 'Irlandia',
    author: '-',
    url: 'https://www.youtube.com/watch?v=BbusgqRc9qg',
  },
  {
    id: 9,
    title: 'Finlandia',
    author: '-',
    url: 'https://www.youtube.com/watch?v=WAGM4A6RFQo',
  },
  {
    id: 10,
    title: 'Norwegia',
    author: '-',
    url: 'https://www.youtube.com/watch?v=DWN2YOOadrU',
  },
  {
    id: 11,
    title: 'Szwecja',
    author: '-',
    url: 'https://www.youtube.com/watch?v=Ifs-TOVOsCE',
  },
  {
    id: 12,
    title: 'Francja',
    author: '-',
    url: 'https://www.youtube.com/watch?v=k9J6rFWTfVA',
  },
  {
    id: 13,
    title: 'Włochy',
    author: '-',
    url: 'https://www.youtube.com/watch?v=NAZ7iFji2s4',
  },
  {
    id: 14,
    title: 'Holandia',
    author: '-',
    url: 'https://www.youtube.com/watch?v=OvgT_-pgvhA',
  },
  {
    id: 15,
    title: 'Belgia',
    author: '-',
    url: 'https://www.youtube.com/watch?v=dkODhGYXsmw',
  },
  {
    id: 16,
    title: 'Hiszpania',
    author: '-',
    url: 'https://www.youtube.com/watch?v=yTszHAk2rfk',
  },
  {
    id: 17,
    title: 'Węgry',
    author: '-',
    url: 'https://www.youtube.com/watch?v=-3c_A51wHYc',
  },
  {
    id: 18,
    title: 'Grecja',
    author: '-',
    url: 'https://www.youtube.com/watch?v=Y7Zgp-EzfOU',
  },
  {
    id: 19,
    title: 'Chorwacja',
    author: '-',
    url: 'https://www.youtube.com/watch?v=1lvHpkndatM',
  },
  {
    id: 20,
    title: 'Serbia',
    author: '-',
    url: 'https://www.youtube.com/watch?v=MiEOsHCUsP8',
  },
  {
    id: 21,
    title: 'Rumunia',
    author: '-',
    url: 'https://www.youtube.com/watch?v=tFNoGl6ckfU',
  },
  {
    id: 22,
    title: 'Bułgaria',
    author: '-',
    url: 'https://www.youtube.com/watch?v=aEQ57nuXe78',
  },
  {
    id: 23,
    title: 'Austria',
    author: '-',
    url: 'https://www.youtube.com/watch?v=_qyTnc8ZxU8',
  },
  {
    id: 24,
    title: 'Rosja',
    author: '-',
    url: 'https://www.youtube.com/watch?v=gzZqdEdZGG8',
  },
  {
    id: 25,
    title: 'Słowenia',
    author: '-',
    url: 'https://www.youtube.com/watch?v=w-WuhiuEOQc',
  },
  {
    id: 26,
    title: 'Turcja',
    author: '-',
    url: 'https://www.youtube.com/watch?v=XXYA3_3nkdE',
  },
  {
    id: 27,
    title: 'Meksyk',
    author: '-',
    url: 'https://www.youtube.com/watch?v=nKW7t9TkQo4',
  },
  {
    id: 28,
    title: 'Kanada',
    author: '-',
    url: 'https://www.youtube.com/watch?v=9RlKkvH4R9k',
  },
  {
    id: 29,
    title: 'USA',
    author: '-',
    url: 'https://www.youtube.com/watch?v=v3xtVXG7HDo',
  },
  {
    id: 30,
    title: 'Kuba ',
    author: '-',
    url: 'https://www.youtube.com/watch?v=l3q0quEHWaI',
  },
  {
    id: 31,
    title: 'Argentyna',
    author: '-',
    url: 'https://www.youtube.com/watch?v=yqBC3l7i7dk',
  },
  {
    id: 32,
    title: 'Brazylia',
    author: '-',
    url: 'https://www.youtube.com/watch?v=AV_ZwQ19MoY',
  },
  {
    id: 33,
    title: 'Kolumbia',
    author: '-',
    url: 'https://www.youtube.com/watch?v=nBU8vVVME-k',
  },
  {
    id: 34,
    title: 'RPA',
    author: '-',
    url: 'https://www.youtube.com/watch?v=Dtg_KtjrIV8',
  },
  {
    id: 35,
    title: 'Egipt',
    author: '-',
    url: 'https://www.youtube.com/watch?v=GHJF_wgyuW0',
  },
  {
    id: 36,
    title: 'Senegal',
    author: '-',
    url: 'https://www.youtube.com/watch?v=VZGdbACrzd8',
  },
  {
    id: 37,
    title: 'Tunezja',
    author: '-',
    url: 'https://www.youtube.com/watch?v=K3xD560vBEY',
  },
  {
    id: 38,
    title: 'Algieria',
    author: '-',
    url: 'https://www.youtube.com/watch?v=z-CBPYBA_Qc',
  },
  {
    id: 39,
    title: 'Iran',
    author: '-',
    url: 'https://www.youtube.com/watch?v=L8cBYtMzb48',
  },
  {
    id: 40,
    title: 'Arabia Saudyjska',
    author: '-',
    url: 'https://www.youtube.com/watch?v=guglmXkm2k4',
  },
  {
    id: 41,
    title: 'Afghanistan',
    author: '-',
    url: 'https://www.youtube.com/watch?v=vsyT84WxMMQ',
  },
  {
    id: 42,
    title: 'Czeczenia',
    author: '-',
    url: 'https://www.youtube.com/watch?v=Ug421hym1Ss',
  },
  {
    id: 43,
    title: 'Gruzja',
    author: '-',
    url: 'https://www.youtube.com/watch?v=wxvkzbArNf4',
  },
  {
    id: 44,
    title: 'Kazachstan',
    author: '-',
    url: 'https://www.youtube.com/watch?v=UamvtFPhFoU',
  },
  {
    id: 45,
    title: 'Indie',
    author: '-',
    url: 'https://www.youtube.com/watch?v=v4wVMVo3kOE',
  },
  {
    id: 46,
    title: 'Pakistan',
    author: '-',
    url: 'https://www.youtube.com/watch?v=auQG8-sVruI',
  },
  {
    id: 47,
    title: 'Chiny',
    author: '-',
    url: 'https://www.youtube.com/watch?v=KCDjk7POz8Y',
  },
  {
    id: 48,
    title: 'Japonia',
    author: '-',
    url: 'https://www.youtube.com/watch?v=29FFHC2D12Q',
  },
  {
    id: 49,
    title: 'Tajlandia',
    author: '-',
    url: 'https://www.youtube.com/watch?v=WFIKR8G8p9k',
  },
  {
    id: 50,
    title: 'Wietnam',
    author: '-',
    url: 'https://www.youtube.com/watch?v=SceSkkRtC2s',
  },
  {
    id: 51,
    title: 'Fidzi',
    author: '-',
    url: 'https://www.youtube.com/watch?v=POcpyUsGtbY',
  },
  {
    id: 52,
    title: 'Samoa',
    author: '-',
    url: 'https://www.youtube.com/watch?v=mfwnNQqhd8g',
  },
  {
    id: 53,
    title: 'Nowa Zelandia',
    author: '-',
    url: 'https://www.youtube.com/watch?v=mhCgcZ0efAA',
  },
  {
    id: 54,
    title: 'Australia',
    author: '-',
    url: 'https://www.youtube.com/watch?v=aQyiZNZaj00',
  },
];

export const musicData = convertMusicToQuiz(inputData);
