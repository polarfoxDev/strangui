import { Routes } from '@angular/router';
import { StrandsComponent } from './strands/strands.component';
import { ResultsComponent } from './results/results.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: StrandsComponent
  },
  {
    path: 'history/:date',
    component: StrandsComponent
  },
  {
    path: 'results',
    component: ResultsComponent
  }
];
