import { inject, Injectable } from "@angular/core";
import { SwUpdate } from "@angular/service-worker";
import { Store } from "@ngrx/store";
import { forkJoin, from, map, Observable, of, switchMap, take, tap } from "rxjs";
import * as CoreAction from "@core-state/core.actions";
import { initialState as initialGameState } from "@game-state/strands.state";
import { GameState, GameStateV1, PersistentGameState } from "../strands/models";
import { lastUpdateCheckResultSelector, lastUpdateCheckSelector, storageVersionSelector } from "./state/core.selectors";
import { GameMetadataByDateMap } from "./state/core.state";
import { StrandsService } from "./strands.service";
import { isVersionNewer } from "./utils";

@Injectable({ providedIn: 'root' })
export class UpdateService {
  private updates = inject(SwUpdate);
  private store = inject(Store);
  private strandsService = inject(StrandsService);

  private lastCheck = '';
  private lastResult = false;

  constructor() {
    this.updates.unrecoverable.subscribe(() => {
      this.installUpdate();
    });
    this.store.select(lastUpdateCheckSelector).subscribe((lastCheck) => {
      this.lastCheck = lastCheck;
    });
    this.store.select(lastUpdateCheckResultSelector).subscribe((lastResult) => {
      this.lastResult = lastResult;
    });
  }

  checkForUpdate(): Observable<boolean> {
    // if last check was less than 5 minutes ago, return last result
    if (new Date().getTime() - new Date(this.lastCheck).getTime() < 5 * 60 * 1000) {
      return of(this.lastResult);
    }
    console.info('Checking for updates...');
    this.store.dispatch(CoreAction.setUpdateCheck(new Date().toISOString()));
    if (!this.updates.isEnabled) {
      return of(false).pipe(tap((result) => this.store.dispatch(CoreAction.setUpdateCheck(undefined, result))));
    }
    return from(this.updates.checkForUpdate()).pipe(tap((result) => this.store.dispatch(CoreAction.setUpdateCheck(undefined, result))));
  }

  installUpdate() {
    this.store.dispatch(CoreAction.setUpdateCheck(new Date().toISOString(), false));
    setTimeout(() => {
      document.location.reload();
    }, 200);
  }

  migrateData(): Observable<string> {
    const storageVersionV1: string | null = JSON.parse(localStorage.getItem('storageVersion') ?? 'null');
    return this.store.select(storageVersionSelector).pipe(take(1)).pipe(
      map(storageVersion => {
        if (storageVersionV1) {
          this.store.dispatch(CoreAction.setStorageVersion(storageVersionV1));
          return storageVersionV1;
        }
        return storageVersion;
      }),
      map(storageVersion => {
        if (isVersionNewer('1.10.0', storageVersion)) {
          console.info('Migrating data from version', storageVersion, 'to 1.10.0');
          Object.keys(localStorage).filter(key => key.startsWith('game-state-')).forEach(key => {
            const gameState: GameStateV1 = JSON.parse(localStorage.getItem(key) || 'null');
            if (!gameState) return;
            gameState.activeHint?.locations.forEach(l => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              l.row = l.row ?? (l as any).x;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              l.col = l.col ?? (l as any).y
            });
            gameState.fixedConnections.forEach(c => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              c.from.row = c.from.row ?? (c.from as any).x;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              c.from.col = c.from.col ?? (c.from as any).y;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              c.to.row = c.to.row ?? (c.to as any).x;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              c.to.col = c.to.col ?? (c.to as any).y;
            });
            gameState.letterStates.forEach(l => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              l.location.row = l.location.row ?? (l.location as any).x;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              l.location.col = l.location.col ?? (l.location as any).y;
            });
            gameState.solutionStates.forEach(s => {
              s.locations.forEach(l => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                l.row = l.row ?? (l as any).x;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                l.col = l.col ?? (l as any).y
              })
            });
            localStorage.setItem(key, JSON.stringify(gameState));
          });
          return '1.10.0';
        }
        return storageVersion;
      }),
      switchMap(storageVersion => {
        if (isVersionNewer('1.12.0', storageVersion)) {
          console.info('Migrating data from version', storageVersion, 'to 1.12.0');
          const changelogSeenForVersion: string | null = JSON.parse(localStorage.getItem('changelogSeenFor') ?? 'null');
          if (changelogSeenForVersion !== null) {
            this.store.dispatch(CoreAction.setChangelogSeenForVersion(changelogSeenForVersion));
          }
          const firstVisit: boolean | null = JSON.parse(localStorage.getItem('firstVisit') ?? 'null');
          if (firstVisit === false) {
            this.store.dispatch(CoreAction.setVisited());
          }
          const metadataMap: GameMetadataByDateMap = {};
          Object.keys(localStorage).filter(key => key.startsWith('game-state-')).forEach(key => {
            const gameState: GameStateV1 = JSON.parse(localStorage.getItem(key) || 'null');
            if (!gameState) return;
            const dateFromKey = key.split('-').slice(2).join('-');
            const gameId = crypto.randomUUID();
            const gameStateV2: PersistentGameState = {
              id: gameId,
              lastChanged: new Date().toISOString(),
              gameState: {
                ...initialGameState,
                date: dateFromKey,
                theme: '::theme::',
                solutionStates: gameState.solutionStates,
                nonSolutionWordsFound: gameState.nonSolutionWordsFound,
                tipsUsed: gameState.tipsUsed,
                gameEvents: gameState.gameEvents,
                activeHintIndex: gameState.activeHint
                  ? gameState.solutionStates.findIndex(
                    solution => solution.locations.some(
                      solutionLoc => gameState.activeHint?.locations.some(
                        activeHintLoc => activeHintLoc.col === solutionLoc.col && activeHintLoc.row === solutionLoc.row
                      )
                    )
                  )
                  : null,
                activeHintInAnimation: gameState.activeHintInAnimation,
                fixedConnections: gameState.fixedConnections,
                letterStates: gameState.letterStates.map((letter) => ({
                  ...letter,
                  hintFoundDelay: 0,
                })),
                readonly: gameState.solutionStates.every(s => s.found),
              } satisfies GameState,
            };
            localStorage.setItem(`game_${gameId}`, JSON.stringify(gameStateV2));
            this.moveToLocalStorageBackup(key, '1_12_0');
            metadataMap[dateFromKey] = {
              id: gameId,
              finished: gameStateV2.gameState.readonly,
            };
          });
          localStorage.setItem('gameOverview', JSON.stringify(metadataMap));
          this.store.dispatch(CoreAction.loadGameList());
          this.moveToLocalStorageBackup('storageVersion', '1_12_0');
          this.moveToLocalStorageBackup('changelogSeenFor', '1_12_0');
          this.moveToLocalStorageBackup('firstVisit', '1_12_0');
          this.moveToLocalStorageBackup('lastUpdateCheckDate', '1_12_0');
          this.moveToLocalStorageBackup('lastUpdateCheckResult', '1_12_0');
          if (Object.keys(metadataMap).length === 0) {
            return of('1.12.0');
          }
          return forkJoin(
            Object.keys(metadataMap)
              .map(date => [date, metadataMap[date].id])
              .map(([date, id]) => this.strandsService.loadRiddle(date).pipe(
                tap(riddleConfig => localStorage.setItem(
                  `game_${id}`,
                  localStorage.getItem(`game_${id}`)!.replace('::theme::', riddleConfig.theme)
                ))
              ))
          ).pipe(
            map(() => '1.12.0')
          )
        }
        return of(storageVersion);
      })
    );
  }

  private moveToLocalStorageBackup(key: string, migrationToVersion: string): void {
    const oldValue = localStorage.getItem(key);
    if (oldValue === null) {
      return;
    }
    localStorage.setItem(`before_migration_${migrationToVersion}_${key}`, oldValue);
    localStorage.removeItem(key);
  }

}
