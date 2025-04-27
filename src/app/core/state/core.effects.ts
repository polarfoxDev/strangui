import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { addGame, loadCoreState, loadCoreStateSuccess, loadGameByDate, loadGameFailure, loadGameList, loadGameListSuccess, loadGameSuccess, setChangelogSeenForVersion, setStorageVersion, setUpdateCheck, setVisited, updateGame } from "./core.actions";
import { switchMap, map, withLatestFrom, catchError, tap } from "rxjs";
import { corePropsToPersist, GameMetadataByDateMap, PersistentCoreState } from "./core.statemodel";
import { activeGameSelector, availableGamesSelector, coreStateSelector } from "./core.selectors";
import { StrandsService } from "../strands.service";
import { upgradeConfigVersion } from "../utils";
import { defaultLetterGrid } from "../constants";
import { Letter, PersistentGameState } from "../../strands/models";
import { initialState as initialGameState } from "../../strands/state/strands.reducer";
import { loadExistingGame } from "../../strands/state/strands.actions";

/* Effects for Core State Management */

export const loadCoreState$ = createEffect(
  ((actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(loadCoreState),
      switchMap(() => {
        const coreState: PersistentCoreState = JSON.parse(localStorage.getItem('peristentCoreState') || '{}');
        return [loadCoreStateSuccess(coreState)];
      }),
    );
  }),
  { functional: true }
);

export const saveCoreState$ = createEffect(
  ((actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(setUpdateCheck, setStorageVersion, setChangelogSeenForVersion, setVisited),
      withLatestFrom(store.select(coreStateSelector)),
      tap(([, coreState]) => {
        localStorage.setItem('peristentCoreState', JSON.stringify(corePropsToPersist(coreState)));
      }),
    );
  }),
  { functional: true, dispatch: false }
);

/* Game Related Effects */

export const loadGameListLocal$ = createEffect(
  ((actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType('[Core] Load Game List'),
      switchMap(() => {
        const gameMetadataMap: GameMetadataByDateMap = JSON.parse(localStorage.getItem('gameOverview') || '{}');
        return [loadGameListSuccess(gameMetadataMap)];
      }),
    );
  }),
  { functional: true }
);

export const loadGameSuccess$ = createEffect(
  ((actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(loadGameSuccess),
      withLatestFrom(store.select(activeGameSelector)),
      switchMap(([action, activeGame]) => {
        if (activeGame) {
          return [loadExistingGame(action.game.gameState)];
        } else {
          return [loadGameFailure('No active game found')];
        }
      })
    );
  }),
  { functional: true }
);

export const loadGameLocal$ = createEffect(
  ((actions$ = inject(Actions), store = inject(Store), strandsService = inject(StrandsService)) => {
    return actions$.pipe(
      ofType(loadGameByDate),
      withLatestFrom(store.select(availableGamesSelector)),
      switchMap(([action, availableGames]) => {
        const gameMetadata = availableGames[action.dateISO];
        if (!gameMetadata) {
          // create a new game
          return strandsService.loadRiddle(action.dateISO).pipe(
            map(riddleConfig => {
              try {
                riddleConfig = upgradeConfigVersion(riddleConfig);
              } catch (error) {
                return loadGameFailure(`Failed to upgrade game config: ${error}`);
              }
              const riddleLetters: string[] = riddleConfig.letters.flat();
              const defaultGridCopy: Letter[] = JSON.parse(JSON.stringify(defaultLetterGrid));
              return addGame({
                id: crypto.randomUUID(),
                lastChanged: new Date().toISOString(),
                gameState: {
                  ...initialGameState,
                  date: action.dateISO,
                  theme: riddleConfig.theme,
                  letterStates: defaultGridCopy.map((letterState) => ({
                    ...letterState,
                    letter: riddleLetters.shift()!,
                  })),
                  solutionStates: riddleConfig.solutions.map((solution) => ({
                    ...solution,
                    found: false,
                  })),
                  tryConnections: [],
                },
              });
            }),
            catchError((error) => {
              return [loadGameFailure(`Failed to load game: ${error}`)];
            }),
          );
        }
        const game: PersistentGameState = JSON.parse(localStorage.getItem(`game_${gameMetadata.id}`) || 'null');
        if (game) {
          return [loadGameSuccess(game)];
        } else {
          return [loadGameFailure(`Game with ID ${gameMetadata.id} not found`)];
        }
      }),
    );
  }),
  { functional: true }
);

export const saveGameChangesLocal$ = createEffect(
  ((actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(updateGame),
      withLatestFrom(store.select(activeGameSelector)),
      switchMap(([, game]) => {
        if (game) {
          if (
            game.gameState.activeHintIndex === null &&
            game.gameState.fixedConnections.length === 0 &&
            game.gameState.gameEvents.length === 0 &&
            game.gameState.nonSolutionWordsFound.length === 0
          ) {
            return []; // nothing important has happened yet in this game
          }
          localStorage.setItem(`game_${game.id}`, JSON.stringify(game));
          const gameOverview: GameMetadataByDateMap = JSON.parse(localStorage.getItem('gameOverview') || '{}');
          if (game.gameState.solutionStates.every(s => s.found)) {
            gameOverview[game.gameState.date] = {
              id: game.id,
              finished: true,
            };
          };
          localStorage.setItem('gameOverview', JSON.stringify(gameOverview));
          return [loadGameList()];
        }
        return [];
      })
    );
  }),
  { functional: true }
);

export const addGameLocal$ = createEffect(
  ((actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(addGame),
      switchMap(action => {
        const game = action.game;
        if (game) {
          localStorage.setItem(`game_${game.id}`, JSON.stringify(game));
          const gameOverview: GameMetadataByDateMap = JSON.parse(localStorage.getItem('gameOverview') || '{}');
          gameOverview[game.gameState.date] = {
            id: game.id,
            finished: game.gameState.solutionStates.every(s => s.found),
          };
          localStorage.setItem('gameOverview', JSON.stringify(gameOverview));
          return [loadGameSuccess(game)];
        }
        return [loadGameFailure('Failed to add game')];
      })
    );
  }),
  { functional: true }
);
