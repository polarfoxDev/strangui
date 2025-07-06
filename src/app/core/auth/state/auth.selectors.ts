import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const FEATURE_KEY = 'AUTH_STATE';
export const authState = createFeatureSelector<AuthState>(FEATURE_KEY);

export const authStateSelector = createSelector(authState, state => state);
export const userIdSelector = createSelector(authState, state => state.userId);
export const hasStoredSecretSelector = createSelector(authState, state => state.hasStoredSecret);
export const isAuthenticatedSelector = createSelector(authState, state => state.isAuthenticated);
export const userSelector = createSelector(authState, state => state.user);
export const userNameSelector = createSelector(authState, state => state.user?.userName);
export const loadingSelector = createSelector(authState, state => state.loading);
