import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import packageJson from '../../package.json';
import { UpdateService } from './core/update.service';
import { Store } from '@ngrx/store';
import { loadCoreState, loadGameList, setUpdateCheck } from './core/state/core.actions';
import { changelogSeenForVersionSelector } from './core/state/core.selectors';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  version = packageJson.version;
  updateService = inject(UpdateService);
  store = inject(Store);
  changelogSeenFor$ = this.store.select(changelogSeenForVersionSelector);

  constructor() {
    this.store.dispatch(loadCoreState());
    this.store.dispatch(setUpdateCheck(new Date(0).toISOString()));
    this.updateService.migrateData();
    this.store.dispatch(loadGameList());
  }
}
