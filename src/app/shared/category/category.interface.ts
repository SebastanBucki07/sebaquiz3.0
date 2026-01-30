export interface Category {
  id: number;
  type: string;
  name: string;
  basePoints: number;
  hints: Hint[];
}

export interface Hint {
  id: string;
  label: string;
  penaltyPercent: number; // eg. 25 = -25%
  content: string;
}
