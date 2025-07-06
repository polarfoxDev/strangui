import { createAction } from '@ngrx/store';
import { UserDto } from '../dto/user.dto';

enum ActionType {
  CHECK_CREDENTIALS = '[Auth] Check for Stored Credentials',
  CHECK_CREDENTIALS_SUCCESS = '[Auth] Check for StoredCredentials Success',
  REQUEST_TOKEN = '[Auth] Request Token',
  REQUEST_TOKEN_WITH_STORED_CREDENTIALS = '[Auth] Request Token with Stored Credentials',
  REQUEST_TOKEN_SUCCESS = '[Auth] Request Token Success',
  REQUEST_TOKEN_FAILURE = '[Auth] Request Token Failure',
  REQUEST_USER = '[Auth] Request User',
  REQUEST_USER_SUCCESS = '[Auth] Request User Success',
  REQUEST_USER_FAILURE = '[Auth] Request User Failure',
  REGISTER_ANONYMOUS_ACCOUNT = '[Auth] Register Anonymous Account',
  REGISTER_ANONYMOUS_ACCOUNT_SUCCESS = '[Auth] Register Anonymous Account Success',
  REGISTER_ANONYMOUS_ACCOUNT_FAILURE = '[Auth] Register Anonymous Account Failure',
}

export const checkCredentials = createAction(
  ActionType.CHECK_CREDENTIALS,
);

export const checkCredentialsSuccess = createAction(
  ActionType.CHECK_CREDENTIALS_SUCCESS,
  (userId: string | null, hasStoredSecret: boolean, hasStoredAccessToken: boolean) => ({ userId, hasStoredSecret, hasStoredAccessToken }),
);

export const requestToken = createAction(
  ActionType.REQUEST_TOKEN,
  (secret: string) => ({ secret }),
);

export const requestTokenWithStoredCredentials = createAction(
  ActionType.REQUEST_TOKEN_WITH_STORED_CREDENTIALS,
);

export const requestTokenSuccess = createAction(
  ActionType.REQUEST_TOKEN_SUCCESS,
);

export const requestTokenFailure = createAction(
  ActionType.REQUEST_TOKEN_FAILURE,
  (error: string) => ({ error }),
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

export const registerAnonymousAccount = createAction(
  ActionType.REGISTER_ANONYMOUS_ACCOUNT,
);

export const registerAnonymousAccountSuccess = createAction(
  ActionType.REGISTER_ANONYMOUS_ACCOUNT_SUCCESS,
  (userId: string) => ({ userId }),
);

export const registerAnonymousAccountFailure = createAction(
  ActionType.REGISTER_ANONYMOUS_ACCOUNT_FAILURE,
  (error: string) => ({ error }),
);
