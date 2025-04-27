import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CoreState } from "./core.statemodel";

export const FeatureKey = 'CORE_STATE';
export const coreState = createFeatureSelector<CoreState>(FeatureKey);
export const activeGameSelector = createSelector(coreState, (state => state.activeGame));
export const availableGamesSelector = createSelector(coreState, (state => state.availableGames));
export const loadingSelector = createSelector(coreState, (state => state.loading));
export const gameLoadingErrorSelector = createSelector(coreState, (state => !state.loading && !state.activeGame));
