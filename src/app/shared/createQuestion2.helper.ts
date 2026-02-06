interface InputItem {
  Id?: number;
  id?: number;
  Answer?: string;
  Tip1?: string;
  Tip2?: string;
  Tip3?: string;
  title?: string;
  author?: string;
  fragment1?: string;
  fragment2?: string;
  fragment3?: string;
}

interface Hint {
  id: string;
  label: string;
  content: string;
  penaltyPercent: number;
}

interface OutputItem {
  id: number;
  answers: { label: string; value: string }[];
  question: string;
  hints: Hint[];
  revealedAnswers: any[];
}

function transformQuizWithHints(data: InputItem[]): OutputItem[] {
  const tmp= data.map(item => {
    const id = item.id ?? item.Id ?? 0;

    // Answers
    const answers: { label: string; value: string }[] = [];
    if (item.title && item.title !== "-") {
      answers.push({ label: "tytul", value: item.title });
    }
    if (item.author) {
      answers.push({ label: "autor", value: item.author });
    }
    if (item.Answer) {
      answers.push({ label: "tytul", value: item.Answer });
    }

    // Question
    const question = item.Answer ?? item.fragment1 ?? "Brak opisu";

    // Hints: zamiana fragmentów i tipów w Hint[]
    const hintKeys = ["fragment1", "fragment2", "fragment3", "Tip1", "Tip2", "Tip3"];
    const hints: Hint[] = [];

    hintKeys.forEach(key => {
      const value = (item as any)[key];
      if (value) {
        const hintIndex = hints.length; // 👈 tylko realne hinty
        hints.push({
          id: `${hintIndex}`,
          label: `Postać ${hintIndex + 1}`,
          content: value,
          penaltyPercent: hintIndex * 20
        });
      }
    });


    return {
      id,
      answers,
      question,
      hints,
      revealedAnswers: []
    };
  });
  console.log(JSON.stringify(tmp, null, 2));
  return tmp
}

// === PRZYKŁAD UŻYCIA ===

const inputData: InputItem[] = [
  {
    "Id": 1,
    "Answer": "Christopher Nolan",
    "Tip1": "PRESTIŻ",
    "Tip2": "MROCZNY RYCERZ",
    "Tip3": "-"
  },
  {
    "Id": 2,
    "Answer": "Justin Lin",
    "Tip1": "SZYBCY I WŚCIEKLI 5",
    "Tip2": "SZYBCY I WŚCIEKLI 6",
    "Tip3": "SZYBCY I WŚCIEKLI 9"
  }
]

export const quizData = transformQuizWithHints(inputData);
