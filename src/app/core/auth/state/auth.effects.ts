import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap } from 'rxjs';
import { AuthService } from '../auth.service';
import * as Action from './auth.actions';

export const checkCredentials$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(Action.checkCredentials),
      switchMap(() => {
        const accessToken = localStorage.getItem('auth_accessToken');
        const accessTokenPayload = accessToken ? JSON.parse(atob(accessToken.split('.')[1])) : null;
        const hasValidAccessToken = accessToken && accessTokenPayload && accessTokenPayload.exp * 1000 > Date.now();

        const refreshToken = localStorage.getItem('auth_refreshToken');
        const refreshTokenPayload = refreshToken ? JSON.parse(atob(refreshToken.split('.')[1])) : null;
        const hasValidRefreshToken = refreshToken && refreshTokenPayload && refreshTokenPayload.exp * 1000 > Date.now();

        if (!hasValidAccessToken && !hasValidRefreshToken) {
          localStorage.removeItem('auth_accessToken');
          localStorage.removeItem('auth_refreshToken');
          return [Action.checkCredentialsSuccess(false, false)];
        }
        return [Action.checkCredentialsSuccess(hasValidAccessToken, hasValidRefreshToken), Action.requestUser()];
      }),
    );
  }, { functional: true },
);

export const getUser$ = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) => {
    return actions$.pipe(
      ofType(Action.requestUser),
      switchMap(() => {
        return authService.getUser().pipe(
          switchMap((user) => {
            return [Action.requestUserSuccess(user)];
          }),
          // Handle errors
          catchError((error) => {
            return [Action.requestUserFailure(error)];
          }),
        );
      }),
    );
  }, { functional: true },
);
