import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RiddleConfig } from '../strands/strands';

@Injectable({
  providedIn: 'root'
})
export class StrandsService {

  private allWords: string[] = [];

  constructor(private http: HttpClient) {
    this.prepareWords('wordlist_de.txt');
  }

  private prepareWords(remoteFileUrl: string): void {
    this.http.get(remoteFileUrl, { responseType: 'text' }).subscribe(
      (data: string) => {
        this.allWords = data.toUpperCase().split('\n');
      }
    );
  }

  wordExists(word: string): boolean {
    return this.allWords.includes(word);
  }

  loadRiddle(date: string): Observable<RiddleConfig> {
    return this.http.get<RiddleConfig>(`/riddle-${date}.json`);
  }
}
