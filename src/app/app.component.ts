import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import packageJson from '../../package.json';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  version = packageJson.version;
}
