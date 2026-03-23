export interface Team {
  id: number;
  name: string;
  points: number;
  avatarUrl: string; // Tutaj trafi link z DiceBear
}

export interface TeamWithCalculatedPoints extends Team {
  calculatedPoints?: number;
}
