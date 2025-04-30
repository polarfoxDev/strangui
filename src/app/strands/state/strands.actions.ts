import { createAction } from "@ngrx/store";
import { GameState, Letter, LetterLocation } from "@game/models";

enum ActionType {
  INITIALIZE = '[Current Game] Initialize',
  LOAD = '[Current Game] Load Existing',
  USE_HINT = '[Current Game] Use hint',
  CURRENT_TRY_APPEND = '[Current Game] Add location to current try',
  CURRENT_TRY_SUBMIT = '[Current Game] Submit current try',
  CURRENT_TRY_CANCEL = '[Current Game] Cancel current try',
  UPDATE_LETTER_STATE = '[Current Game] Update letter state',
  COMPLETE = '[Current Game] Complete',
}

export const useHint = createAction(
  ActionType.USE_HINT
);

export const loadExistingGame = createAction(
  ActionType.LOAD,
  (gameState: GameState) => ({ gameState })
);

export const appendToCurrentTry = createAction(
  ActionType.CURRENT_TRY_APPEND,
  (locationToAppend: LetterLocation) => ({ locationToAppend })
);

export const submitCurrentTry = createAction(
  ActionType.CURRENT_TRY_SUBMIT,
  (acceptableTryWords: string[]) => ({ acceptableTryWords })
);

export const cancelCurrentTry = createAction(
  ActionType.CURRENT_TRY_CANCEL
);

export const updateLetterState = createAction(
  ActionType.UPDATE_LETTER_STATE,
  (letterUpdate: Partial<Letter> & { location: LetterLocation }) => ({ letterUpdate })
);

export const completeGame = createAction(
  ActionType.COMPLETE
);
