import { HttpClient, HttpParams } from '@angular/common/http';
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
    const params = new HttpParams()
      .set('primaryLanguage', navigator.language)
      .set('additionalLanguages', navigator.languages.join(','));
    return this.http.get<RiddleConfigUnknownVersion>(new URL(`${environment.apiBaseUrl}/riddles/${date}`).toString(), { params });
  }
}
