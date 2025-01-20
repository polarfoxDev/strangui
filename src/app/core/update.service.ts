import { inject, Injectable } from "@angular/core";
import { SwUpdate } from "@angular/service-worker";
import { from, Observable, of, tap } from "rxjs";
import { AppStorage } from "./storage";

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
}
