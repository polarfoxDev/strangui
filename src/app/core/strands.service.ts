import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GameState, GameStatus, Letter, RiddleConfigUnknownVersion, Solution } from '../strands/models';
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

  getRiddleStatus(date: string): GameStatus {
    const gameState = AppStorage.get<GameState>(`game-state-${date}`);
    const status = gameState ?
      gameState.solutionStates.length > 0 && gameState.solutionStates.every(s => s.found) ?
        GameStatus.Finished
        : gameState.solutionStates.length > 0 && gameState.solutionStates.some(s => s.found) || gameState.nonSolutionWordsFound.length > 0 ?
          GameStatus.InProgress
          : GameStatus.NotStarted
      : GameStatus.NotStarted;
    return status;
  }

  loadRiddle(date: string): Observable<RiddleConfigUnknownVersion> {
    return this.http.get<RiddleConfigUnknownVersion>(`${this.BASE_URL}/riddle-${date}.json?appVersion=` + packageJson.version);
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
