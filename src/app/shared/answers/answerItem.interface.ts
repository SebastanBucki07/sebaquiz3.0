export interface AnswerItem {
  label?: string; // optional: "title", "author"
  value: string;
  football?:AnswerItem2
}


export interface AnswerItem2 {
  firstTeam: footballTeam,
  secondTeam: footballTeam
}

export interface footballPlayer {
  surname: string,
  position: number,
  country: string,
  guessed?:boolean,
  guessedBy?:string
}

export interface footballTeam {
  formation: string,
  footballers: footballPlayer[]
  substitutes?: footballPlayer[]
}
