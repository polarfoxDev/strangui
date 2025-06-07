import { UserDto } from '../dto/user.dto';

export const initialState: AuthState = {
  userId: null,
  hasStoredSecret: false,
  isAuthenticated: false,
  user: null,
  loading: false,
};

export interface AuthState {
  userId: string | null;
  hasStoredSecret: boolean;
  isAuthenticated: boolean;
  user: UserDto | null;
  loading: boolean;
}
