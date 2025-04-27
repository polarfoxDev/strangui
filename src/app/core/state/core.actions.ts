import { createAction } from "@ngrx/store";
import { GameState, PersistentGameState } from "../../strands/models";
import { GameMetadataByDateMap } from "./core.statemodel";

export enum ActionTypes {
  ADD_GAME = '[Core] Add Game',
  REMOVE_GAME = '[Core] Remove Game',
  UPDATE_GAME = '[Core] Update Game',
}

export const addGame = createAction(
  ActionTypes.ADD_GAME,
  (game: PersistentGameState) => ({ game })
);

export const updateGame = createAction(
  ActionTypes.UPDATE_GAME,
  (gameState: GameState) => ({ gameState })
);

export const loadGameByDate = createAction(
  '[Core] Load Game by ISO Date',
  (dateISO: string) => ({ dateISO })
);

export const loadGameSuccess = createAction(
  '[Core] Load Game Success',
  (game: PersistentGameState) => ({ game })
);

export const loadGameFailure = createAction(
  '[Core] Load Game Failure',
  (error: any) => ({ error })
);

export const loadGameList = createAction(
  '[Core] Load Game List'
);

export const loadGameListSuccess = createAction(
  '[Core] Load Game List Success',
  (gameMetadataMap: GameMetadataByDateMap) => ({ gameMetadataMap })
);
