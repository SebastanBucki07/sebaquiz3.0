import { Question } from '../questions/question.interface';

export function mapOldFamiliadaToNew(oldQuestions: any[]): Question[] {
  return oldQuestions.map((q) => {
    const rawAnswers = [q.answer1, q.answer2, q.answer3, q.answer4, q.answer5, q.answer6];
    return {
      id: q.id,
      question: q.question,
      revealedAnswers: [],
      showAnswer: false,
      answers: rawAnswers
        .filter((val) => val && val !== '-' && val.trim() !== '')
        .map((value, index) => ({
          value: value.trim(),
          points: [35, 25, 15, 10, 8, 7][index] || 5,
        })),
    };
  });
}
