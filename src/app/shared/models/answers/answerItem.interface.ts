export interface AnswerItem {
  label?: string;
  value: string;
  football?: FootballAnswerItem;
}

export interface FootballAnswerItem {
  firstTeam: FootballTeam;
  secondTeam: FootballTeam;
}

export interface Footballer {
  surname: string;
  position: number;
  country: string;
  guessed?: boolean;
  guessedBy?: string;
}

export interface FootballTeam {
  formation: string;
  footballers: Footballer[];
  substitutes?: Footballer[];
}
