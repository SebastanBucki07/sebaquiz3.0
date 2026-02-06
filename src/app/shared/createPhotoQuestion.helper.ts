interface InputItem {
  Id?: number;
  id?: number;

  Answer?: string;   // stare quizy
  name?: string;     // 👈 DLA ZDJĘĆ
  photo?: string;    // 👈 DLA ZDJĘĆ

  Tip1?: string;
  Tip2?: string;
  Tip3?: string;

  title?: string;
  author?: string;

  fragment1?: string;
  fragment2?: string;
  fragment3?: string;
  type?: string;
}

type OutputItem = {
  id: number;
  answers: { value: string }[];
  question: string;
  hints: any[];
  revealedAnswers: any[];
};

interface Hint {
  id: string;
  label: string;
  content: string;
  penaltyPercent: number;
}

function transformQuizWithHints(data: InputItem[]): OutputItem[] {
  const tmp = data.map(item => {
    const id = item.id ?? item.Id ?? 0;

    /** =====================
     *  ANSWERS
     * ===================== */
    const answers: { label: string; value: string }[] = [];

    // case: PHOTO QUIZ
    if (item.name) {
      answers.push({ label: "odpowiedz", value: item.name });
    }

    // case: NORMAL QUIZ
    if (item.title && item.title !== "-") {
      answers.push({ label: "tytul", value: item.title });
    }
    if (item.author) {
      answers.push({ label: "autor", value: item.author });
    }
    if (item.Answer) {
      answers.push({ label: "odpowiedz", value: item.Answer });
    }

    /** =====================
     *  QUESTION
     * ===================== */
    const question =
      item.photo ??                 // 👈 zdjęcie ma PRIORYTET
      item.Answer ??
      item.fragment1 ??
      "Brak opisu";

    /** =====================
     *  HINTS
     * ===================== */
    const hints: Hint[] = [];

    // jeżeli to quiz ze zdjęciem → brak hintów
    if (!item.photo) {
      const hintKeys = ["fragment1", "fragment2", "fragment3", "Tip1", "Tip2", "Tip3"];

      hintKeys.forEach(key => {
        const value = (item as any)[key];
        if (value && value !== "-") {
          const hintIndex = hints.length;
          hints.push({
            id: `${hintIndex}`,
            label: `Podpowiedź ${hintIndex + 1}`,
            content: value,
            penaltyPercent: hintIndex * 20
          });
        }
      });
    }

    return {
      id,
      answers,
      question,
      hints,
      revealedAnswers: []
    };
  });

  console.log(JSON.stringify(tmp, null, 2));
  return tmp;
}


const inputPhotos: InputItem[] = [
  {
    "id": 1,
    "name": "Wieża Eiffla",
    "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg/129px-Tour_Eiffel_Wikimedia_Commons.jpg"
  },
  {
    "id": 2,
    "name": "Koloseum",
    "photo": "https://upload.wikimedia.org/wikipedia/commons/d/d8/Colosseum_in_Rome-April_2007-1-_copie_2B.jpg"
  }
]

export const photoQuiz = transformQuizWithHints(inputPhotos);
