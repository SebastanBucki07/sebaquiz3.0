type InputMovie = {
  id: number;
  title: string;
  description: string;
};

type OutputMovie = {
  id: number;
  answers: { value: string }[];
  question: string;
  hints: any[];
  revealedAnswers: any[];
};

function transformMovies(data: InputMovie[]): OutputMovie[] {
  const tmp = data.map(movie => ({
    id: movie.id,
    answers: [{ value: movie.title }],
    question: hideTitlePartsAdvanced(movie.description, movie.title),
    hints: [],
    revealedAnswers: []
  }));
  console.log(JSON.stringify(tmp, null, 2));
  return tmp;
}

const STOP_WORDS = new Set([
  "NA", "I", "Z", "W", "DO", "O", "A", "ORAZ", "POD", "NAD", "OD"
]);

function getStem(word: string): string {
  return word.slice(0, Math.max(4, word.length - 2));
}

function hideTitlePartsAdvanced(description: string, title: string): string {
  const stems = title
      .split(/\s+/)
      .map(w => w.replace(/[^\p{L}]/gu, ""))
      .filter(w =>
          w.length >= 4 &&
          !STOP_WORDS.has(w.toUpperCase())
      )
      .map(getStem);

  if (stems.length === 0) return description;

  const pattern = stems.join("|");
  const regex = new RegExp(`\\b(${pattern})\\p{L}*\\b`, "giu");

  return description.replace(regex, "[...]");
}


const input = [
  {
    "id": 1,
    "title": "SKAZANI NA SHAWSHANK",
    "description": "Adaptacja opowiadania Stephena Kinga. Niesłusznie skazany na dożywocie bankier, stara się przetrwać w brutalnym, więziennym świecie."
  },
  {
    "id": 2,
    "title": "NIETYKALNI",
    "description": "Sparaliżowany milioner zatrudnia do opieki młodego chłopaka z przedmieścia, który właśnie wyszedł z więzienia."
  }
]

export const TEST = transformMovies(input);
