import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { merge, timer } from 'rxjs';
import { map, withLatestFrom, mergeMap, tap, switchMap } from 'rxjs/operators';
import { completeGame, submitCurrentTry, updateLetterState } from './strands.actions';
import { Store } from '@ngrx/store';
import { currentGameState, dateSelector, finishedSelector, letterStatesSelector } from './strands.selectors';
import { Router } from '@angular/router';
import { updateGame } from '../../core/state/core.actions';

export const resetHintFoundDelay$ = createEffect(
  ((actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(submitCurrentTry),
      withLatestFrom(store.select(letterStatesSelector)),
      mergeMap(([, letterStates]) =>
        merge(
          ...letterStates.filter(l => l.hintFoundDelay > 0).map(l => {
            return timer(1000 + l.hintFoundDelay).pipe(map(() => updateLetterState({
              location: l.location,
              hintFoundDelay: 0,
            })));
          })
        ),
      ));
  }),
  { functional: true }
);

export const finishGame$ = createEffect(
  ((actions$ = inject(Actions), store = inject(Store), router = inject(Router)) => {
    return actions$.pipe(
      ofType(submitCurrentTry),
      withLatestFrom(
        store.select(finishedSelector),
        store.select(dateSelector),
        store.select(currentGameState),
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
          return [completeGame()];
        }
        return [];
      })
    );
  }),
  { functional: true }
);

export const saveChanges$ = createEffect(
  ((actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(submitCurrentTry, updateLetterState, completeGame),
      withLatestFrom(store.select(currentGameState)),
      switchMap(([, currentGameState]) => {
        return [updateGame(currentGameState)];
      })
    );
  }),
  { functional: true }
);
