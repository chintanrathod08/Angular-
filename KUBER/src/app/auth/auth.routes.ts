import { Routes } from '@angular/router';
import { SigninComponent } from './pages/signin.component';
import { SignupComponent } from './pages/signup.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
];
