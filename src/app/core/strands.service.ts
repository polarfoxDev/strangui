import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GameState, Letter, RiddleConfig, Solution } from '../strands/models';
import { AppStorage, SafeStorageAccessor } from './storage';
import packageJson from '../../../package.json';

@Injectable({
  providedIn: 'root'
})
export class StrandsService {

  private allWords: string[] = [];
  private readonly BASE_URL = 'https://rätsel.stränge.de';

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
    return this.http.get<RiddleConfig>(`${this.BASE_URL}/riddle-${date}.json?appVersion=` + packageJson.version);
  }

  getGameStateAccessor(date: string, solutionFallback: Solution[], letterFallback: Letter[]): SafeStorageAccessor<GameState> {
    return AppStorage.safeAccessor<GameState>(`game-state-${date}`, {
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
