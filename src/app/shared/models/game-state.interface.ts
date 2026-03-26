import {TeamInWritingCategory} from './teams/teamForWrittingCategory.interface';

export interface GameParticipant extends TeamInWritingCategory {
    isEliminated: boolean; // mistakes >= MAX_CHANCES
  hasFinishedTurn: boolean;
}
