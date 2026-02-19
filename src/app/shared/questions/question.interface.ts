import { AnswerItem } from '../answers/answerItem.interface';
import { Hint } from '../category/category.interface';

export interface Question {
  id: number;
  question: string;
  answers: AnswerItem[];
  hints?: Hint[];
  showAnswer?: boolean;
  revealedAnswers?: number[];
}
