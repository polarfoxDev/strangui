import { createAction } from "@ngrx/store";
import { GameState, Letter, LetterLocation, RiddleConfig } from "../models";

export enum ActionTypes {
  INITIALIZE = '[Current Game] Initialize',
  LOAD = '[Current Game] Load Existing',
  USE_HINT = '[Current Game] Use hint',
  CURRENT_TRY_APPEND = '[Current Game] Add location to current try',
  CURRENT_TRY_SUBMIT = '[Current Game] Submit current try',
  CURRENT_TRY_CANCEL = '[Current Game] Cancel current try',
  UPDATE_LETTER_STATE = '[Current Game] Update letter state',
}

export const useHint = createAction(
  ActionTypes.USE_HINT
);

export const initializeGame = createAction(
  ActionTypes.INITIALIZE,
  (riddleConfig: RiddleConfig, isoDate: string) => ({ riddleConfig, isoDate })
);

export const loadExistingGame = createAction(
  ActionTypes.LOAD,
  (gameState: GameState) => ({ gameState })
);

export const appendToCurrentTry = createAction(
  ActionTypes.CURRENT_TRY_APPEND,
  (locationToAppend: LetterLocation) => ({ locationToAppend })
);

export const submitCurrentTry = createAction(
  ActionTypes.CURRENT_TRY_SUBMIT,
  (acceptableTryWords: string[]) => ({ acceptableTryWords })
);

export const cancelCurrentTry = createAction(
  ActionTypes.CURRENT_TRY_CANCEL
);

export const updateLetterState = createAction(
  ActionTypes.UPDATE_LETTER_STATE,
  (letterUpdate: Partial<Letter> & { location: LetterLocation }) => ({ letterUpdate })
);
