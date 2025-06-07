import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '@env/environment';
import * as AuthAction from '@auth-state/auth.actions';
import { SigninDto } from './dto/signin.dto';
import { UserDto } from './dto/user.dto';

interface AuthResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private store = inject(Store);

  createAnonymousAccount(): Observable<SigninDto> {
    return this.http.post<SigninDto>(new URL(`${environment.apiBaseUrl}/users`).toString(), {});
  }

  signIn(id: string, secret: string): Observable<void> {
    return this.http.post<AuthResponse>(new URL(`${environment.apiBaseUrl}/auth/login`).toString(), { id, secret }).pipe(
      map((response: AuthResponse) => {
        localStorage.setItem('auth_accessToken', response.access_token);
      }),
    );
  }

  getUser(): Observable<UserDto> {
    return this.http.get<UserDto>(new URL(`${environment.apiBaseUrl}/users/me`).toString(), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_accessToken')}`,
      },
    }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          localStorage.removeItem('auth_accessToken');
          this.store.dispatch(AuthAction.requestTokenWithStoredCredentials());
        }
        return [];
      }),
    );
  }
}
