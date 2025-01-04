import { Routes } from '@angular/router';
import { StrandsComponent } from './strands/strands.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: StrandsComponent
  },
  {
    path: 'history/:date',
    component: StrandsComponent
  }
];
