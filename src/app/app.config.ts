import { ApplicationConfig, provideZoneChangeDetection, isDevMode, LOCALE_ID } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { registerLocaleData } from '@angular/common';
import { routes } from './app.routes';
import localeDe from '@angular/common/locales/de';

import { FeatureKey as CoreFeatureKey } from './core/state/core.selectors';
import { FeatureKey as CurrentGameFeatureKey } from './strands/state/strands.selectors';
import { getCoreReducer } from './core/state/core.reducer';
import { getCurrentGameReducer } from './strands/state/strands.reducer';
import * as coreEffects from './core/state/core.effects';
import * as strandsEffects from './strands/state/strands.effects';

registerLocaleData(localeDe);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    { provide: LOCALE_ID, useValue: 'de' },
    provideStore(),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true // If set to true, the connection is established within the Angular zone
    }),
    provideState({ name: CoreFeatureKey, reducer: getCoreReducer }),
    provideState({ name: CurrentGameFeatureKey, reducer: getCurrentGameReducer }),
    provideEffects(coreEffects, strandsEffects)
  ]
};
