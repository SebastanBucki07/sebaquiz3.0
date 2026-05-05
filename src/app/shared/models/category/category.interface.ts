import { Hint } from './hint.interface';

export interface Category {
  id: number;
  type: string;
  name: string;
  basePoints: number;
  hints: Hint[];
  icon: string;
  color: string;
  timer_seconds?: number;
}
