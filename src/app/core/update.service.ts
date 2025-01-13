import { Injectable } from "@angular/core";
import { SwUpdate, VersionReadyEvent } from "@angular/service-worker";
import { from, Observable, of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UpdateService {

  constructor(private updates: SwUpdate) {
    updates.unrecoverable.subscribe(() => {
      this.installUpdate();
    });
  }

  checkForUpdate(): Observable<boolean> {
    if (!this.updates.isEnabled) {
      return of(false);
    }
    return from(this.updates.checkForUpdate());
  }

  installUpdate() {
    document.location.reload();
  }
}
