import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CoreState } from "./core.state";

export const FEATURE_KEY = 'CORE_STATE';
export const coreState = createFeatureSelector<CoreState>(FEATURE_KEY);

export const coreStateSelector = createSelector(coreState, (state => state));
export const activeGameSelector = createSelector(coreState, (state => state.activeGame));
export const availableGamesSelector = createSelector(coreState, (state => state.availableGames));
export const loadingSelector = createSelector(coreState, (state => state.loading));
export const gameLoadingErrorDetailsSelector = createSelector(coreState, (state => state.gameLoadingError));
export const gameLoadingErrorSelector = createSelector(coreState, (state => !state.loading && !state.activeGame));

export const lastUpdateCheckSelector = createSelector(coreState, (state => state.lastUpdateCheck));
export const lastUpdateCheckResultSelector = createSelector(coreState, (state => state.lastUpdateCheckResult));
export const storageVersionSelector = createSelector(coreState, (state => state.storageVersion));
export const changelogSeenForVersionSelector = createSelector(coreState, (state => state.changelogSeenForVersion));
export const firstVisitSelector = createSelector(coreState, (state => state.firstVisit));
