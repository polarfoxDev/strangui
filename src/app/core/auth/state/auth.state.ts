import { UserDto } from '../dto/user.dto';

export const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
};

export interface AuthState {
  isAuthenticated: boolean;
  user: UserDto | null;
  loading: boolean;
}
