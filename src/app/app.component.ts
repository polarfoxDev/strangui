import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import packageJson from '../../package.json';
import { UpdateService } from './core/update.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  version = packageJson.version;
  constructor(updateService: UpdateService) {
    console.info('App version:', this.version);
    updateService.lastCheck.set(new Date(0).toISOString());
  }
}
