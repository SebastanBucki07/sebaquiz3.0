import { Question } from '../questions/question.interface';

export function mapOldFamiliadaToNew(q: any): Question {
  // Jeśli q.answers to już gotowa tablica (z JSONB w Supabase)
  const finalAnswers = Array.isArray(q.answers)
    ? q.answers
    : [
        { value: q.answer1, points: 35 },
        { value: q.answer2, points: 25 },
        { value: q.answer3, points: 15 },
        { value: q.answer4, points: 10 },
        { value: q.answer5, points: 8 },
        { value: q.answer6, points: 7 },
      ].filter((a) => a.value && a.value !== '-' && a.value !== '');

  return {
    id: q.id,
    question: q.question,
    answers: finalAnswers,
    // Mapowanie nazwy z bazy (snake_case) na TS (camelCase)
    revealedAnswers: q.revealed_answers || q.revealedAnswers || [],
    showAnswer: false,
  };
}
