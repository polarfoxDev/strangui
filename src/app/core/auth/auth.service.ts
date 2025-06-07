import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '@env/environment';
import * as AuthAction from '@auth-state/auth.actions';
import { UserDto } from './dto/user.dto';

interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private store = inject(Store);

  constructor() {
    this.store.dispatch(AuthAction.checkCredentials());
    // run silent refresh check every minute
    setInterval(() => {
      this.silentRefreshIfNeeded().subscribe({
        next: () => {
          console.log('Token still valid or silent refresh successful');
        },
        error: (error) => {
          console.warn('Silent refresh failed:', error);
        },
      });
    }, 1 * 60 * 1000); // 1 minute
  }

  logout(): void {
    localStorage.removeItem('auth_accessToken');
    localStorage.removeItem('auth_refreshToken');
    this.store.dispatch(AuthAction.checkCredentials());
  }

  getAccessToken(): Observable<string> {
    const accessToken = localStorage.getItem('auth_accessToken');
    if (accessToken && this.tokenIsValid(accessToken)) {
      return of(accessToken);
    }
    return this.refreshToken().pipe(
      map(() => {
        const newAccessToken = localStorage.getItem('auth_accessToken');
        if (newAccessToken && this.tokenIsValid(newAccessToken)) {
          return newAccessToken;
        }
        throw new Error('No valid access token found');
      }),
      catchError(() => {
        localStorage.removeItem('auth_accessToken');
        throw new Error('Failed to refresh access token');
      }),
    );
  }

  silentRefreshIfNeeded(): Observable<void> {
    return this.getAccessToken().pipe(
      map(() => {
        // If we successfully get a valid access token, we do nothing
        // getAccessToken will handle the refresh logic
      }),
      catchError((error) => {
        throw new Error('Silent refresh failed: ' + error.message);
      }),
    );
  }

  private tokenIsValid(token: string): boolean {
    if (!token) {
      return false;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Consider token invalid if it expires in less than 1 minute (60,000 ms)
    return payload.exp * 1000 > Date.now() + 60000;
  }

  signIn(userName: string, secret: string): Observable<void> {
    return this.http.post<AuthResponse>(new URL(`${environment.apiBaseUrl}/auth/login`).toString(), { userName, secret }).pipe(
      map((response: AuthResponse) => {
        localStorage.setItem('auth_accessToken', response.access_token);
        localStorage.setItem('auth_refreshToken', response.refresh_token);
        this.store.dispatch(AuthAction.requestUser());
      }),
    );
  }

  refreshToken(): Observable<void> {
    const refreshToken = localStorage.getItem('auth_refreshToken');
    if (!refreshToken || !this.tokenIsValid(refreshToken)) {
      throw new Error('No valid refresh token found');
    }
    return this.http.post<AuthResponse>(new URL(`${environment.apiBaseUrl}/auth/refresh`).toString(), { refreshToken }).pipe(
      map((response: AuthResponse) => {
        localStorage.setItem('auth_accessToken', response.access_token);
        localStorage.setItem('auth_refreshToken', response.refresh_token);
      }),
    );
  }

  register(userName: string, secret: string): Observable<UserDto> {
    return this.http.post<UserDto>(new URL(`${environment.apiBaseUrl}/users`).toString(), { userName, secret });
  }

  getUser(): Observable<UserDto> {
    return this.http.get<UserDto>(new URL(`${environment.apiBaseUrl}/users/me`).toString(), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_accessToken')}`,
      },
    }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.refreshToken().subscribe({
            next: () => {
              this.store.dispatch(AuthAction.requestUser());
            },
            error: () => {
              this.store.dispatch(AuthAction.requestUserFailure('Failed to refresh token'));
            },
          });
        }
        return [];
      }),
    );
  }
}
