import { createAction } from "@ngrx/store";
import { GameState, PersistentGameState } from "../../strands/models";
import { GameMetadataByDateMap, PersistentCoreState } from "./core.statemodel";

export enum ActionTypes {
  /* Core Actions */
  LOAD_CORE_STATE = '[Core] Load Core State from Storage',
  LOAD_CORE_STATE_SUCCESS = '[Core] Load Core State Success',
  SET_UPDATE_CHECK = '[Core] Set Update Check',
  SET_STORAGE_VERSION = '[Core] Set Storage Version',
  SET_CHANGELOG_SEEN_FOR_VERSION = '[Core] Set Changelog Seen for Version',
  SET_VISITED = '[Core] Set First Visit to false',
  /* Game Related Actions */
  ADD_GAME = '[Core] Add Game',
  UPDATE_GAME = '[Core] Update Game',
  LOAD_GAME_BY_DATE = '[Core] Load Game by Date',
  LOAD_GAME_SUCCESS = '[Core] Load Game Success',
  LOAD_GAME_FAILURE = '[Core] Load Game Failure',
  LOAD_GAME_LIST = '[Core] Load Game List',
  LOAD_GAME_LIST_SUCCESS = '[Core] Load Game List Success',
  LOAD_GAME_LIST_FAILURE = '[Core] Load Game List Failure',
}

/* Core Actions */

export const loadCoreState = createAction(
  ActionTypes.LOAD_CORE_STATE
);

export const loadCoreStateSuccess = createAction(
  ActionTypes.LOAD_CORE_STATE_SUCCESS,
  (coreState: PersistentCoreState) => ({ coreState })
);

export const setUpdateCheck = createAction(
  ActionTypes.SET_UPDATE_CHECK,
  (lastUpdateCheck?: string, lastUpdateCheckResult?: boolean) => ({
    lastUpdateCheck,
    lastUpdateCheckResult,
  })
);

export const setStorageVersion = createAction(
  ActionTypes.SET_STORAGE_VERSION,
  (storageVersion: string) => ({ storageVersion })
);

export const setChangelogSeenForVersion = createAction(
  ActionTypes.SET_CHANGELOG_SEEN_FOR_VERSION,
  (changelogSeenForVersion: string) => ({ changelogSeenForVersion })
);

export const setVisited = createAction(
  ActionTypes.SET_VISITED
);

/* Game Related Actions */

export const addGame = createAction(
  ActionTypes.ADD_GAME,
  (game: PersistentGameState) => ({ game })
);

export const updateGame = createAction(
  ActionTypes.UPDATE_GAME,
  (gameState: GameState) => ({ gameState })
);

export const loadGameByDate = createAction(
  ActionTypes.LOAD_GAME_BY_DATE,
  (dateISO: string) => ({ dateISO })
);

export const loadGameSuccess = createAction(
  ActionTypes.LOAD_GAME_SUCCESS,
  (game: PersistentGameState) => ({ game })
);

export const loadGameFailure = createAction(
  ActionTypes.LOAD_GAME_FAILURE,
  (error: unknown) => ({ error })
);

export const loadGameList = createAction(
  ActionTypes.LOAD_GAME_LIST
);

export const loadGameListSuccess = createAction(
  ActionTypes.LOAD_GAME_LIST_SUCCESS,
  (gameMetadataMap: GameMetadataByDateMap) => ({ gameMetadataMap })
);
