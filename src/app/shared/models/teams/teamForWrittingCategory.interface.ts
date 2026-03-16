import { TeamWithCalculatedPoints } from './team.interface';

export interface TeamInWritingCategory extends TeamWithCalculatedPoints {
  mistakes: number;
  chancesLeft: number;
  correctAnswers: number;
  color: string;
}
