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
        const userId = localStorage.getItem('auth_userId');
        const hasStoredSecret = localStorage.getItem('auth_secret') !== null;
        const hasStoredAccessToken = localStorage.getItem('auth_accessToken') !== null;
        if (!userId) {
          localStorage.removeItem('auth_accessToken');
          return [Action.checkCredentialsSuccess(null, false, false), Action.registerAnonymousAccount()];
        }
        return [Action.checkCredentialsSuccess(userId, hasStoredSecret, hasStoredAccessToken)];
      }),
    );
  }, { functional: true },
);

export const login$ = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) => {
    return actions$.pipe(
      ofType(Action.requestToken),
      switchMap(({ secret }) => {
        const userId = localStorage.getItem('auth_userId');
        if (!userId) {
          return [Action.requestTokenFailure('No user ID found')];
        }
        return authService.signIn(userId, secret).pipe(
          switchMap(() => {
            return [
              Action.requestTokenSuccess(),
              Action.requestUser(),
            ];
          }),
          // Handle errors
          catchError((error) => {
            return [Action.requestTokenFailure(error)];
          }),
        );
      }),
    );
  }, { functional: true },
);

export const loginWithStoredCredentials$ = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) => {
    return actions$.pipe(
      ofType(Action.requestTokenWithStoredCredentials),
      switchMap(() => {
        const userId = localStorage.getItem('auth_userId');
        if (!userId) {
          return [Action.requestTokenFailure('No user ID found')];
        }
        const secret = localStorage.getItem('auth_secret');
        if (!secret) {
          return [Action.requestTokenFailure('No secret found')];
        }
        return authService.signIn(userId, secret).pipe(
          switchMap(() => {
            return [
              Action.requestTokenSuccess(),
              Action.requestUser(),
            ];
          }),
          // Handle errors
          catchError((error) => {
            return [Action.requestTokenFailure(error)];
          }),
        );
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

export const registerAnonymousAccount$ = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) => {
    return actions$.pipe(
      ofType(Action.registerAnonymousAccount),
      switchMap(() => {
        return authService.createAnonymousAccount().pipe(
          switchMap(({ id, secret }) => {
            localStorage.setItem('auth_userId', id);
            localStorage.setItem('auth_secret', secret);
            return [Action.registerAnonymousAccountSuccess(id)];
          }),
          // Handle errors
          catchError((error) => {
            return [Action.registerAnonymousAccountFailure(error)];
          }),
        );
      }),
    );
  }, { functional: true },
);
