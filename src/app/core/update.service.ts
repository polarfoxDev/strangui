import { inject, Injectable } from "@angular/core";
import { SwUpdate } from "@angular/service-worker";
import { from, Observable, of, tap } from "rxjs";
import { AppStorage } from "./storage";
import { GameState, GameStateV1 } from "../strands/models";
import { isVersionNewer } from "./utils";

@Injectable({ providedIn: 'root' })
export class UpdateService {
  private updates = inject(SwUpdate);
  lastCheck = AppStorage.safeAccessor<string>('lastUpdateCheckDate', '1970-01-01T00:00:00.000Z');
  lastResult = AppStorage.safeAccessor<boolean>('lastUpdateCheckResult', false);

  constructor() {
    this.updates.unrecoverable.subscribe(() => {
      this.installUpdate();
    });
  }

  checkForUpdate(): Observable<boolean> {
    // if last check was less than 5 minutes ago, return last result
    if (new Date().getTime() - new Date(this.lastCheck.get()).getTime() < 5 * 60 * 1000) {
      return of(this.lastResult.get());
    }
    console.info('Checking for updates...');
    this.lastCheck.set(new Date().toISOString());
    if (!this.updates.isEnabled) {
      return of(false).pipe(tap((result) => this.lastResult.set(result)));
    }
    return from(this.updates.checkForUpdate()).pipe(tap((result) => this.lastResult.set(result)));
  }

  installUpdate() {
    this.lastCheck.set(new Date().toISOString());
    this.lastResult.set(false);
    document.location.reload();
  }

  migrateData(from: string): void {
    if (isVersionNewer('1.10.0', from)) { // first migration, needed for 1.10.0 and later
      console.info('Migrating data from version', from, 'to 1.10.0');
      Object.keys(localStorage).filter(key => key.startsWith('game-state-')).forEach(key => {
        const gameState = AppStorage.get<GameStateV1>(key);
        if (!gameState) return;
        gameState.activeHint?.locations.forEach(l => {
          l.row = l.row ?? (l as any).x;
          l.col = l.col ?? (l as any).y
        });
        gameState.fixedConnections.forEach(c => {
          c.from.row = c.from.row ?? (c.from as any).x;
          c.from.col = c.from.col ?? (c.from as any).y;
          c.to.row = c.to.row ?? (c.to as any).x;
          c.to.col = c.to.col ?? (c.to as any).y;
        });
        gameState.letterStates.forEach(l => {
          l.location.row = l.location.row ?? (l.location as any).x;
          l.location.col = l.location.col ?? (l.location as any).y;
        });
        gameState.solutionStates.forEach(s => {
          s.locations.forEach(l => {
            l.row = l.row ?? (l as any).x;
            l.col = l.col ?? (l as any).y
          })
        });
        AppStorage.set<GameStateV1>(key, gameState);
      });
      AppStorage.set<string>('storageVersion', '1.10.0');
    }
  }
}
