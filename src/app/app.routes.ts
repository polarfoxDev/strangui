import { Routes } from '@angular/router';
import { StrandsComponent } from './strands/strands.component';
import { ResultsComponent } from './results/results.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { DateSelectorComponent } from './date-selector/date-selector.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: StrandsComponent
  },
  {
    path: 'tutorial',
    component: TutorialComponent
  },
  {
    path: 'history',
    component: DateSelectorComponent
  },
  {
    path: ':date',
    component: StrandsComponent
  },
  {
    path: ':date/tutorial',
    component: TutorialComponent
  },
  {
    path: ':date/results',
    component: ResultsComponent
  },
];
