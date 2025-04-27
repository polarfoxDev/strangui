import { createReducer, on } from "@ngrx/store";
import { CoreState } from "./core.statemodel";
import { addGame, loadGameByDate, loadGameFailure, loadGameList, loadGameListSuccess, loadGameSuccess, updateGame } from "./core.actions";
import { Letter } from "../../strands/models";

export const initialState: CoreState = {
  activeGame: null,
  availableGames: {},
  loading: false,
};

export const getCoreReducer = createReducer(
  initialState,
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
