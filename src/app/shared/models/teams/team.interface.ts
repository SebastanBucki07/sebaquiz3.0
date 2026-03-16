export interface Team {
  id: number;
  name: string;
  points: number;
}

export interface TeamWithCalculatedPoints extends Team {
  calculatedPoints?: number;
}
