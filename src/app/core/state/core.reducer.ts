import { createReducer, on } from "@ngrx/store";
import { Letter } from "../../strands/models";
import * as Action from "./core.actions";
import { initialState } from "./core.state";

export const reducer = createReducer(
  initialState,
  /* Core Actions */
  on(Action.loadCoreStateSuccess, (state, { coreState }) => ({
    ...state,
    ...coreState,
  })),
  on(Action.setUpdateCheck, (state, { lastUpdateCheck, lastUpdateCheckResult }) => ({
    ...state,
    lastUpdateCheck: lastUpdateCheck ?? state.lastUpdateCheck,
    lastUpdateCheckResult: lastUpdateCheckResult ?? state.lastUpdateCheckResult,
  })),
  on(Action.setStorageVersion, (state, { storageVersion }) => ({
    ...state,
    storageVersion,
  })),
  on(Action.setChangelogSeenForVersion, (state, { changelogSeenForVersion }) => ({
    ...state,
    changelogSeenForVersion,
  })),
  on(Action.setVisited, (state) => ({
    ...state,
    firstVisit: false,
  })),
  /* Game Related Actions */
  on(Action.loadGameList, (state) => ({
    ...state,
    loading: true,
  })),
  on(Action.loadGameListSuccess, (state, { gameMetadataMap }) => ({
    ...state,
    availableGames: gameMetadataMap,
    loading: false,
  })),
  on(Action.addGame, (state, { game }) => ({
    ...state,
    activeGame: game,
  })),
  on(Action.loadGameByDate, (state) => ({
    ...state,
    loading: true,
  })),
  on(Action.loadGameSuccess, (state, { game }) => ({
    ...state,
    activeGame: game,
    loading: false,
  })),
  on(Action.loadGameFailure, (state, { error, displayError }) => ({
    ...state,
    activeGame: null,
    gameLoadingError: displayError ? error : '',
    loading: false,
  })),
  on(Action.updateGame, (state, { gameState }) => ({
    ...state,
    activeGame: state.activeGame ? {
      ...state.activeGame,
      gameState: {
        ...gameState,
        letterStates: gameState.letterStates.map((letter: Letter) => ({
          ...letter,
          hintFoundDelay: 0,
        })),
      },
      lastChanged: (new Date()).toISOString(),
    } : null,
  })),
);
