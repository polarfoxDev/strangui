import { createReducer, on } from "@ngrx/store";
import { initialState } from "./core.statemodel";
import { addGame, loadCoreState, loadCoreStateSuccess, loadGameByDate, loadGameFailure, loadGameList, loadGameListSuccess, loadGameSuccess, setChangelogSeenForVersion, setStorageVersion, setUpdateCheck, setVisited, updateGame } from "./core.actions";
import { Letter } from "../../strands/models";

export const getCoreReducer = createReducer(
  initialState,
  /* Core Actions */
  on(loadCoreStateSuccess, (state, { coreState }) => ({
    ...state,
    ...coreState,
  })),
  on(setUpdateCheck, (state, { lastUpdateCheck, lastUpdateCheckResult }) => ({
    ...state,
    lastUpdateCheck: lastUpdateCheck ?? state.lastUpdateCheck,
    lastUpdateCheckResult: lastUpdateCheckResult ?? state.lastUpdateCheckResult,
  })),
  on(setStorageVersion, (state, { storageVersion }) => ({
    ...state,
    storageVersion,
  })),
  on(setChangelogSeenForVersion, (state, { changelogSeenForVersion }) => ({
    ...state,
    changelogSeenForVersion,
  })),
  on(setVisited, (state) => ({
    ...state,
    firstVisit: false,
  })),
  /* Game Related Actions */
  on(loadGameList, (state) => ({
    ...state,
    loading: true,
  })),
  on(loadGameListSuccess, (state, { gameMetadataMap }) => ({
    ...state,
    availableGames: gameMetadataMap,
    loading: false,
  })),
  on(addGame, (state, { game }) => ({
    ...state,
    activeGame: game,
  })),
  on(loadGameByDate, (state) => ({
    ...state,
    loading: true,
  })),
  on(loadGameSuccess, (state, { game }) => ({
    ...state,
    activeGame: game,
    loading: false,
  })),
  on(loadGameFailure, (state) => ({
    ...state,
    activeGame: null,
    loading: false,
  })),
  on(updateGame, (state, { gameState }) => ({
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
