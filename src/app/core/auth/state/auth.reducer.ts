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
  on(Action.checkCredentialsSuccess, (state, { userId, hasStoredSecret, hasStoredAccessToken }) => ({
    ...state,
    loading: false,
    userId,
    hasStoredSecret,
    isAuthenticated: hasStoredAccessToken,
  })),
  on(Action.requestToken, state => ({
    ...state,
    loading: true,
    isAuthenticated: false,
  })),
  on(Action.requestTokenSuccess, state => ({
    ...state,
    loading: false,
    isAuthenticated: true,
  })),
  on(Action.requestTokenFailure, state => ({
    ...state,
    loading: false,
    isAuthenticated: false,
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
  on(Action.registerAnonymousAccount, state => ({
    ...state,
    loading: true,
    isAuthenticated: false,
  })),
  on(Action.registerAnonymousAccountSuccess, (state, { userId }) => ({
    ...state,
    loading: false,
    userId,
    hasStoredSecret: true,
  })),
  on(Action.registerAnonymousAccountFailure, (state, { error }) => ({
    ...state,
    loading: false,
    isAuthenticated: false,
    error,
  })),
);
