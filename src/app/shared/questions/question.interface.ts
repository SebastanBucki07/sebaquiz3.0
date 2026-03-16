import { AnswerItem } from '../models/answers/answerItem.interface';
import { Hint } from '../models/category/hint.interface';

export interface Question {
  id: number;
  question: string;
  answers: AnswerItem[];
  hints?: Hint[];
  showAnswer?: boolean;
  revealedAnswers?: number[];
}
