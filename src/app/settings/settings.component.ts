import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthSelector from '@auth-state/auth.selectors';
import { AuthService } from '@auth/auth.service';

@Component({
  selector: 'app-settings',
  imports: [RouterModule, AsyncPipe],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  private authService = inject(AuthService);
  private store = inject(Store);

  user$ = this.store.select(AuthSelector.userSelector);
  authLoading$ = this.store.select(AuthSelector.loadingSelector);

  logout(): void {
    this.authService.logout();
  }
}
