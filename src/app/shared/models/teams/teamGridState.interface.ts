import { TeamWithCalculatedPoints } from './team.interface';

export interface TeamGridState extends TeamWithCalculatedPoints {
  calculatedPoints: number;
}
