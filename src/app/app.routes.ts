import { Routes } from '@angular/router';
import { StrandsComponent } from './strands/strands.component';
import { ResultsComponent } from './results/results.component';
import { TutorialComponent } from './tutorial/tutorial.component';

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
