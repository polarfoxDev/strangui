import { createReducer, on } from '@ngrx/store';
import * as Action from './auth.actions';
import { initialState } from './auth.state';

export const reducer = createReducer(
  initialState,
  on(Action.checkCredentials, state => ({
    ...state,
    loading: true,
    isAuthenticated: false,
  })),
  on(Action.checkCredentialsSuccess, (state, { hasValidAccessToken, hasValidRefreshToken }) => ({
    ...state,
    loading: false,
    isAuthenticated: hasValidAccessToken || hasValidRefreshToken,
    user: hasValidAccessToken || hasValidRefreshToken ? state.user : null,
  })),
  on(Action.requestUser, state => ({
    ...state,
    loading: true,
    user: null,
  })),
  on(Action.requestUserSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    user,
  })),
  on(Action.requestUserFailure, state => ({
    ...state,
    loading: false,
    user: null,
  })),
);
