import { GameStatus } from '../strands/models';

export interface CalendarDate {
  date: Date;
  isToday: boolean;
  gameStatus: GameStatus;
}

export interface CalendarMonth {
  previousAvailable: boolean;
  nextAvailable: boolean;
  gridOffset: number;
  dates: CalendarDate[];
}
