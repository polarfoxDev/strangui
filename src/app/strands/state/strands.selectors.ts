import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameState } from '../models';

export const FEATURE_KEY = 'CURRENT_GAME_STATE';
export const currentGameState = createFeatureSelector<GameState>(FEATURE_KEY);

export const tipsUsedSelector = createSelector(currentGameState, state => state.tipsUsed);
export const finishedSelector = createSelector(currentGameState, state => state.solutionStates.every(s => s.found));
export const completedSelector = createSelector(currentGameState, state => state.readonly);
export const allConnectionsSelector = createSelector(currentGameState, state => state.fixedConnections.concat(state.tryConnections));
export const themeSelector = createSelector(currentGameState, state => state.theme);
export const statusTextSelector = createSelector(currentGameState, state => state.statusText);
export const statusColorSelector = createSelector(currentGameState, state => state.statusColor);
export const letterStatesSelector = createSelector(currentGameState, state => state.letterStates);
export const nonSolutionWordsFoundLengthSelector = createSelector(currentGameState, state => state.nonSolutionWordsFound.length);
export const unusedHintWordCountSelector = createSelector(currentGameState, state => state.nonSolutionWordsFound.length - state.tipsUsed * 3);
export const solutionCountSelector = createSelector(currentGameState, state => state.solutionStates.length);
export const finishedSolutionCountSelector = createSelector(currentGameState, state => state.solutionStates.filter(s => s.found).length);
export const dateSelector = createSelector(currentGameState, state => state.date);
