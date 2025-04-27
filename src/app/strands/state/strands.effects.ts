import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { merge, timer } from 'rxjs';
import { map, withLatestFrom, mergeMap, switchMap, exhaustMap, tap } from 'rxjs/operators';
import { submitCurrentTry, updateLetterState } from './strands.actions';
import { Store } from '@ngrx/store';
import { dateSelector, finishedSelector, letterStatesSelector } from './strands.selectors';
import { Router } from '@angular/router';

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
      ),
      tap(([, finished, dateISO]) => {
        if (finished) {
          setTimeout(() => {
            router.navigate(['/', dateISO, 'results']);
          }, 1000);
        }
      })
    );
  }),
  { functional: true, dispatch: false }
);
