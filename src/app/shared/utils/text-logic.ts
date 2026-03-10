export const normalizeText = (value: string): string => {
  if (!value) return '';
  return value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/-/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();
};

export const levenshteinDistance = (a: string, b: string): number => {
  const matrix: number[][] = Array.from({length: a.length + 1}, () =>
    new Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
};

export const areSimilar = (input: string, answer: string): boolean => {
  const normInput = normalizeText(input);
  const normAnswer = normalizeText(answer);

  if (normInput === normAnswer) return true;

  // Kolejność słów
  const sortWords = (s: string) => s.split(' ').sort().join(' ');
  if (sortWords(normInput) === sortWords(normAnswer)) return true;

  const maxEdits = normAnswer.length >= 7 ? 3 : 1;
  return levenshteinDistance(normInput, normAnswer) <= maxEdits;
};

// Dodajmy też helper do punktów, żeby był w jednym miejscu
export const calculateGamePoints = (correct: number, total: number, multiplier: number): number => {
  if (total === 0) return 0;
  // Zmieniamy na Math.round, żeby uniknąć zawyżania punktów
  return Math.ceil((correct / total) * multiplier);
};

