import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import * as CoreAction from '@core-state/core.actions';
import { changelogSeenForVersionSelector } from '@core-state/core.selectors';
import { UpdateService } from '@core/update.service';
import packageJson from '../../package.json';
import { SpinnerComponent } from "./spinner/spinner.component";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, AsyncPipe, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  version = packageJson.version;
  updateService = inject(UpdateService);
  store = inject(Store);
  changelogSeenFor$ = this.store.select(changelogSeenForVersionSelector);
  migrationRunning = true;

  constructor() {
    this.store.dispatch(CoreAction.loadCoreState());
    this.updateService.migrateData().subscribe(migratedTo => {
      this.store.dispatch(CoreAction.setStorageVersion(migratedTo));
      this.migrationRunning = false;
      this.store.dispatch(CoreAction.setUpdateCheck(new Date(0).toISOString()));
      this.store.dispatch(CoreAction.loadGameList());
    })
  }
}
