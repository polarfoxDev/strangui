import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, take } from 'rxjs';
import { environment } from '@env/environment';
import * as AuthAction from '@auth-state/auth.actions';
import * as AuthSelector from '@auth-state/auth.selectors';
import { RiddleConfigUnknownVersion } from '@game/models';

@Injectable({
  providedIn: 'root',
})
export class StrandsService {
  private http = inject(HttpClient);
  private store = inject(Store);

  constructor() {
    setTimeout(() => {
      combineLatest([
        this.store.select(AuthSelector.loadingSelector),
        this.store.select(AuthSelector.hasStoredSecretSelector),
        this.store.select(AuthSelector.userIdSelector),
        this.store.select(AuthSelector.isAuthenticatedSelector),
      ]).pipe(take(1)).subscribe(([loading, hasStoredSecret, userId, isAuthenticated]) => {
        if (loading) {
          return;
        }
        if (hasStoredSecret && userId && !isAuthenticated) {
          this.store.dispatch(AuthAction.requestTokenWithStoredCredentials());
          return;
        }
        if (userId && isAuthenticated) {
          this.store.dispatch(AuthAction.requestUser());
        }
      });
    });
  }

  getAcceptableTryWords(): Observable<string[]> {
    return this.http.get('wordlist_de.txt', { responseType: 'text' }).pipe(
      map((data: string) =>
        data.toUpperCase().split('\n'),
      ),
    );
  }

  loadRiddle(date: string): Observable<RiddleConfigUnknownVersion> {
    return this.http.get<RiddleConfigUnknownVersion>(new URL(`${environment.apiBaseUrl}/riddles/${date}`).toString());
  }
}
