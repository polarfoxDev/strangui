import { createAction } from '@ngrx/store';
import { UserDto } from '../dto/user.dto';

enum ActionType {
  CHECK_CREDENTIALS = '[Auth] Check for Stored Credentials',
  CHECK_CREDENTIALS_SUCCESS = '[Auth] Check for StoredCredentials Success',
  REQUEST_USER = '[Auth] Request User',
  REQUEST_USER_SUCCESS = '[Auth] Request User Success',
  REQUEST_USER_FAILURE = '[Auth] Request User Failure',
};

export const checkCredentials = createAction(
  ActionType.CHECK_CREDENTIALS,
);

export const checkCredentialsSuccess = createAction(
  ActionType.CHECK_CREDENTIALS_SUCCESS,
  (hasValidAccessToken: boolean, hasValidRefreshToken: boolean) => ({ hasValidAccessToken, hasValidRefreshToken }),
);

export const requestUser = createAction(
  ActionType.REQUEST_USER,
);

export const requestUserSuccess = createAction(
  ActionType.REQUEST_USER_SUCCESS,
  (user: UserDto) => ({ user }),
);

export const requestUserFailure = createAction(
  ActionType.REQUEST_USER_FAILURE,
  (error: string) => ({ error }),
);
