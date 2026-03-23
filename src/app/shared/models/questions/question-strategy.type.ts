import { Question } from '../../questions/question.interface';

export type QuestionLoader = () => Question[] | Promise<Question[]>;
