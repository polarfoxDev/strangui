import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import packageJson from '../../package.json';
import { UpdateService } from './core/update.service';
import { AppStorage } from './core/storage';
import { Store } from '@ngrx/store';
import { loadGameList } from './core/state/core.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  version = packageJson.version;
  changelogSeenFor = AppStorage.getSafe<string>('changelogSeenFor', '0.0.0');
  updateService = inject(UpdateService);
  store = inject(Store);

  constructor() {
    console.info('App version:', this.version);
    this.updateService.lastCheck.set(new Date(0).toISOString());
    this.updateService.migrateData(AppStorage.getSafe<string>('storageVersion', '0.0.0'));
    this.store.dispatch(loadGameList());
  }
}
