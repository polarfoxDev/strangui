import { Routes } from '@angular/router';
import { StrandsComponent } from './strands/strands.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'daily',
    pathMatch: 'full'
  },
  {
    path: 'daily',
    component: StrandsComponent
  }
];
