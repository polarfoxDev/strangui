import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { RiddleConfigUnknownVersion } from '@game/models';

@Injectable({
  providedIn: 'root',
})
export class StrandsService {
  private http = inject(HttpClient);

  getAcceptableTryWords(): Observable<string[]> {
    return this.http.get('wordlist_de.txt', { responseType: 'text' }).pipe(
      map((data: string) =>
        data.toUpperCase().split('\n'),
      ),
    );
  }

  loadRiddle(date: string): Observable<RiddleConfigUnknownVersion> {
    return this.http.get<RiddleConfigUnknownVersion>(new URL(`${environment.riddleBaseUrl}/${date}`).toString());
  }
}
