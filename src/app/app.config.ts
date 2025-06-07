import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import { ApplicationConfig, provideZoneChangeDetection, isDevMode, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import * as authEffects from '@auth-state/auth.effects';
import { reducer as authReducer } from '@auth-state/auth.reducer';
import { FEATURE_KEY as AUTH_FEATURE_KEY } from '@auth-state/auth.selectors';
import * as coreEffects from '@core-state/core.effects';
import { reducer as coreReducer } from '@core-state/core.reducer';
import { FEATURE_KEY as CORE_FEATURE_KEY } from '@core-state/core.selectors';
import * as strandsEffects from '@game-state/strands.effects';
import { reducer as currentGameReducer } from '@game-state/strands.reducer';
import { FEATURE_KEY as CURRENT_GAME_FEATURE_KEY } from '@game-state/strands.selectors';
import { routes } from './app.routes';

registerLocaleData(localeDe);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    { provide: LOCALE_ID, useValue: 'de' },
    provideStore(),
    ...isDevMode()
      ? [provideStoreDevtools({
          maxAge: 25, // Retains last 25 states
          logOnly: false, // Do not restrict extension to log-only mode
          autoPause: true, // Pauses recording actions and state changes when the extension window is not open
          trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
          traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
          connectInZone: true, // If set to true, the connection is established within the Angular zone
        })]
      : [],
    provideState({ name: AUTH_FEATURE_KEY, reducer: authReducer }),
    provideState({ name: CORE_FEATURE_KEY, reducer: coreReducer }),
    provideState({ name: CURRENT_GAME_FEATURE_KEY, reducer: currentGameReducer }),
    provideEffects(authEffects, coreEffects, strandsEffects),
  ],
};
