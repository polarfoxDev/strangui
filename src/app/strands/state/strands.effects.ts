import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { merge, timer } from 'rxjs';
import { map, withLatestFrom, mergeMap, switchMap } from 'rxjs/operators';
import * as CoreAction from '@core-state/core.actions';
import * as Action from './strands.actions';
import * as Selector from './strands.selectors';

export const resetHintFoundDelay$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(Action.submitCurrentTry),
      withLatestFrom(store.select(Selector.letterStatesSelector)),
      mergeMap(([, letterStates]) =>
        merge(
          ...letterStates.filter(l => l.hintFoundDelay > 0).map((l) => {
            return timer(1000 + l.hintFoundDelay).pipe(map(() => Action.updateLetterState({
              location: l.location,
              hintFoundDelay: 0,
            })));
          }),
        ),
      ));
  },
  { functional: true },
);

export const finishGame$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store), router = inject(Router)) => {
    return actions$.pipe(
      ofType(Action.submitCurrentTry),
      withLatestFrom(
        store.select(Selector.finishedSelector),
        store.select(Selector.dateSelector),
        store.select(Selector.currentGameState),
      ),
      switchMap(([, finished, dateISO, currentGameState]) => {
        if (currentGameState.readonly) {
          return [];
        }
        if (finished) {
          setTimeout(() => {
            console.log('Navigating to results');
            router.navigate(['/', dateISO, 'results']);
          }, 1000);
          return [Action.completeGame()];
        }
        return [];
      }),
    );
  },
  { functional: true },
);

export const saveChanges$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(Action.submitCurrentTry, Action.updateLetterState, Action.completeGame),
      withLatestFrom(store.select(Selector.currentGameState)),
      switchMap(([, currentGameState]) => {
        return [CoreAction.updateGame(currentGameState)];
      }),
    );
  },
  { functional: true },
);
