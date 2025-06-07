import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, withLatestFrom, catchError, tap } from 'rxjs';
import { defaultLetterGrid, unavailableDates } from '@core/constants';
import { StrandsService } from '@core/strands.service';
import { upgradeConfigVersion } from '@core/utils';
import * as GameAction from '@game-state/strands.actions';
import { initialState as initialGameState } from '@game-state/strands.state';
import { Letter, PersistentGameState } from '@game/models';
import * as Action from './core.actions';
import { activeGameSelector, availableGamesSelector, coreStateSelector } from './core.selectors';
import { corePropsToPersist, GameMetadataByDateMap, PersistentCoreState } from './core.state';

/* Effects for Core State Management */

export const loadCoreState$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(Action.loadCoreState),
      switchMap(() => {
        const coreState: PersistentCoreState = JSON.parse(localStorage.getItem('peristentCoreState') || '{}');
        return [Action.loadCoreStateSuccess(coreState)];
      }),
    );
  },
  { functional: true },
);

export const saveCoreState$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(Action.setUpdateCheck, Action.setStorageVersion, Action.setChangelogSeenForVersion, Action.setVisited),
      withLatestFrom(store.select(coreStateSelector)),
      tap(([, coreState]) => {
        localStorage.setItem('peristentCoreState', JSON.stringify(corePropsToPersist(coreState)));
      }),
    );
  },
  { functional: true, dispatch: false },
);

/* Game Related Effects */

export const loadGameListLocal$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(Action.loadGameList),
      switchMap(() => {
        const gameMetadataMap: GameMetadataByDateMap = JSON.parse(localStorage.getItem('gameOverview') || '{}');
        return [Action.loadGameListSuccess(gameMetadataMap)];
      }),
    );
  },
  { functional: true },
);

export const loadGameSuccess$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(Action.loadGameSuccess),
      withLatestFrom(store.select(activeGameSelector)),
      switchMap(([action, activeGame]) => {
        if (activeGame) {
          return [GameAction.loadExistingGame(action.game.gameState)];
        }
        else {
          return [Action.loadGameFailure('No active game found')];
        }
      }),
    );
  },
  { functional: true },
);

export const loadGameLocal$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store), strandsService = inject(StrandsService)) => {
    return actions$.pipe(
      ofType(Action.loadGameByDate),
      withLatestFrom(store.select(availableGamesSelector)),
      switchMap(([action, availableGames]) => {
        if (unavailableDates.includes(action.dateISO)) {
          return [Action.loadGameFailure('Das Rätsel für diesen Tag ist aus technischen Gründen leider nicht mehr verfügbar. Komm gern morgen wieder oder spiele in der Zwischenzeit ein altes Rätsel.', true)];
        }
        const gameMetadata = availableGames[action.dateISO];
        if (!gameMetadata) {
          // create a new game
          return strandsService.loadRiddle(action.dateISO).pipe(
            map((riddleConfig) => {
              try {
                riddleConfig = upgradeConfigVersion(riddleConfig);
              }
              catch (error) {
                return Action.loadGameFailure(`Failed to upgrade game config: ${error}`);
              }
              const riddleLetters: string[] = riddleConfig.letters.flat();
              const defaultGridCopy: Letter[] = JSON.parse(JSON.stringify(defaultLetterGrid));
              return Action.addGame({
                id: crypto.randomUUID(),
                lastChanged: new Date().toISOString(),
                gameState: {
                  ...initialGameState,
                  date: action.dateISO,
                  theme: riddleConfig.theme,
                  letterStates: defaultGridCopy.map(letterState => ({
                    ...letterState,
                    letter: riddleLetters.shift()!,
                  })),
                  solutionStates: riddleConfig.solutions.map(solution => ({
                    ...solution,
                    found: false,
                  })),
                  tryConnections: [],
                },
              });
            }),
            catchError((error) => {
              return [Action.loadGameFailure(`Failed to load game: ${error}`)];
            }),
          );
        }
        const game: PersistentGameState = JSON.parse(localStorage.getItem(`game_${gameMetadata.id}`) || 'null');
        if (game) {
          return [Action.loadGameSuccess(game)];
        }
        else {
          return [Action.loadGameFailure(`Game with ID ${gameMetadata.id} not found`)];
        }
      }),
    );
  },
  { functional: true },
);

export const saveGameChangesLocal$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(Action.updateGame),
      withLatestFrom(store.select(activeGameSelector)),
      switchMap(([, game]) => {
        if (game) {
          if (
            game.gameState.activeHintIndex === null
            && game.gameState.fixedConnections.length === 0
            && game.gameState.gameEvents.length === 0
            && game.gameState.nonSolutionWordsFound.length === 0
          ) {
            return []; // nothing important has happened yet in this game
          }
          localStorage.setItem(`game_${game.id}`, JSON.stringify(game));
          const gameOverview: GameMetadataByDateMap = JSON.parse(localStorage.getItem('gameOverview') || '{}');
          gameOverview[game.gameState.date].started = true;
          if (game.gameState.solutionStates.every(s => s.found)) {
            gameOverview[game.gameState.date].finished = true;
          }
          localStorage.setItem('gameOverview', JSON.stringify(gameOverview));
          return [Action.loadGameList()];
        }
        return [];
      }),
    );
  },
  { functional: true },
);

export const addGameLocal$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(Action.addGame),
      switchMap((action) => {
        const game = action.game;
        if (game) {
          localStorage.setItem(`game_${game.id}`, JSON.stringify(game));
          const gameOverview: GameMetadataByDateMap = JSON.parse(localStorage.getItem('gameOverview') || '{}');
          gameOverview[game.gameState.date] = {
            id: game.id,
            finished: game.gameState.solutionStates.every(s => s.found),
            started: false,
          };
          localStorage.setItem('gameOverview', JSON.stringify(gameOverview));
          return [Action.loadGameSuccess(game)];
        }
        return [Action.loadGameFailure('Failed to add game')];
      }),
    );
  },
  { functional: true },
);
