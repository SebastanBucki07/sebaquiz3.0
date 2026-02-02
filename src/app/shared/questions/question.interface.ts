import {AnswerItem} from '../answers/answerItem.interface';

export interface Question {
  id: number;
  question: string;
  answers: AnswerItem[];
  hints?: string[];
  showAnswer?: boolean;
  revealedAnswers?: number[]
}
