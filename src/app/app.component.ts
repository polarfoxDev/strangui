import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import packageJson from '../../package.json';
import { UpdateService } from './core/update.service';
import { AppStorage } from './core/storage';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  version = packageJson.version;
  changelogSeenFor = AppStorage.getSafe<string>('changelogSeenFor', '0.0.0');
  constructor() {
    console.info('App version:', this.version);
    inject(UpdateService).lastCheck.set(new Date(0).toISOString());
  }
}
