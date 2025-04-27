import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GameState, GameStateV1, GameStatus, Letter, RiddleConfigUnknownVersion, Solution } from '../strands/models';
import { AppStorage, SafeStorageAccessor } from './storage';
import packageJson from '../../../package.json';

@Injectable({
  providedIn: 'root'
})
export class StrandsService {
  private http = inject(HttpClient);

  private allWords: string[] = [];
  private readonly BASE_URL = 'https://rätsel.stränge.de';

  constructor() {
    this.prepareWords('wordlist_de.txt');
  }

  getAcceptableTryWords(): Observable<string[]> {
    return this.http.get('wordlist_de.txt', { responseType: 'text' }).pipe(
      map((data: string) =>
        data.toUpperCase().split('\n')
      )
    );
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

  loadRiddle(date: string): Observable<RiddleConfigUnknownVersion> {
    return this.http.get<RiddleConfigUnknownVersion>(`${this.BASE_URL}/riddle-${date}.json?appVersion=` + packageJson.version);
  }

  getGameStateAccessor(date: string, solutionFallback: Solution[], letterFallback: Letter[]): SafeStorageAccessor<GameStateV1> {
    return AppStorage.safeAccessor<GameStateV1>(`game-state-${date}`, {
      solutionStates: solutionFallback,
      nonSolutionWordsFound: [],
      tipsUsed: 0,
      gameEvents: [],
      activeHint: null,
      activeHintInAnimation: false,
      fixedConnections: [],
      letterStates: letterFallback
    });
  }

  getCurrentGameState(date: string): GameState | null {
    return AppStorage.get<GameState>(`game-state-${date}`);
  }
}
