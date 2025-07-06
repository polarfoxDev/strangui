import { Routes } from '@angular/router';
import { ChangelogComponent } from './changelog/changelog.component';
import { DateSelectorComponent } from './date-selector/date-selector.component';
import { ResultsComponent } from './results/results.component';
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
