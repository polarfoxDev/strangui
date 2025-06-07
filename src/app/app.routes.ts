import { Routes } from '@angular/router';
import { ChangelogComponent } from './changelog/changelog.component';
import { DateSelectorComponent } from './date-selector/date-selector.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResultsComponent } from './results/results.component';
import { SettingsComponent } from './settings/settings.component';
import { StrandsComponent } from './strands/strands.component';
import { TutorialComponent } from './tutorial/tutorial.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: StrandsComponent,
  },
  {
    path: 'tutorial',
    redirectTo: 'anleitung',
  },
  {
    path: 'settings',
    redirectTo: 'einstellungen',
  },
  {
    path: 'news',
    redirectTo: 'neuigkeiten',
  },
  {
    path: 'history',
    redirectTo: 'vergangenheit',
  },
  {
    path: ':date/tutorial',
    redirectTo: ':date/anleitung',
  },
  {
    path: ':date/results',
    redirectTo: ':date/ergebnis',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'einstellungen',
    component: SettingsComponent,
  },
  {
    path: 'anleitung',
    component: TutorialComponent,
  },
  {
    path: 'neuigkeiten',
    component: ChangelogComponent,
  },
  {
    path: 'vergangenheit',
    component: DateSelectorComponent,
  },
  {
    path: ':date',
    component: StrandsComponent,
  },
  {
    path: ':date/anleitung',
    component: TutorialComponent,
  },
  {
    path: ':date/ergebnis',
    component: ResultsComponent,
  },
];
