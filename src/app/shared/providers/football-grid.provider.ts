import { FootballGridLogic } from '../football-grid.logic';
import { footballers } from '../footballers/footballers';
import { Question } from '../questions/question.interface';

export class FootballGridProvider {
  /**
   * Generuje pulę plansz do kółka i krzyżyk i mapuje je na format Question
   */
  static getGridQuestions(poolSize: number = 50): Question[] {
    const pool = FootballGridLogic.generatePool(footballers, poolSize);

    return pool.map((board) => ({
      id: board.id,
      question: 'Football Grid',
      answers: [
        {
          value: JSON.stringify({
            rows: board.rows,
            cols: board.cols,
            grid: board.grid,
          }),
        },
      ],
      showAnswer: false,
      revealedAnswers: [],
    }));
  }
}
