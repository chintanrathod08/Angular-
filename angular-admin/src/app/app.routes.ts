import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './pages/home/home.component'; 
import { AddprojectComponent } from './pages/addproject/addproject.component';
import { AllprojectComponent } from './pages/allproject/allproject.component';
import { EstimatesComponent } from './pages/estimates/estimates.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent }, 
  { path: 'addproject', component: AddprojectComponent },
  { path: 'allproject', component: AllprojectComponent },
  { path: 'estimate', component: EstimatesComponent },
  { path: 'projectdetails', component: ProjectDetailsComponent }
];
