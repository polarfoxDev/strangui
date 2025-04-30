import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RiddleConfigUnknownVersion } from '@game/models';
import packageJson from '../../../package.json';

@Injectable({
  providedIn: 'root'
})
export class StrandsService {
  private http = inject(HttpClient);
  private readonly BASE_URL = 'https://rätsel.stränge.de';

  getAcceptableTryWords(): Observable<string[]> {
    return this.http.get('wordlist_de.txt', { responseType: 'text' }).pipe(
      map((data: string) =>
        data.toUpperCase().split('\n')
      )
    );
  }

  loadRiddle(date: string): Observable<RiddleConfigUnknownVersion> {
    return this.http.get<RiddleConfigUnknownVersion>(`${this.BASE_URL}/riddle-${date}.json?appVersion=` + packageJson.version);
  }

}
