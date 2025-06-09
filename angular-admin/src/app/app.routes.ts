import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './pages/home/home.component'; 
import { AddprojectComponent } from './pages/addproject/addproject.component';
import { AllprojectComponent } from './pages/allproject/allproject.component';
import { EstimatesComponent } from './pages/estimates/estimates.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { AuthGuard } from './guards/auth.guard';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { AddEmployeeComponent } from './pages/addemployee/addemployee.component';
import { AllemployeeComponent } from './pages/allemployee/allemployee.component';
import { EmployeeprofileComponent } from './pages/employeeprofile/employeeprofile.component';
import { AttendanceListComponent } from './pages/attendance-list/attendance-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Public routes (no login needed)
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // Protected routes (require login)
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }, 
  { path: 'addproject', component: AddprojectComponent, canActivate: [AuthGuard]},
  { path: 'allproject', component: AllprojectComponent, canActivate: [AuthGuard]},
  { path: 'estimate', component: EstimatesComponent, canActivate: [AuthGuard]},
  { path: 'projectdetails/:id', component: ProjectDetailsComponent, canActivate: [AuthGuard]},
  { path: 'addemployee', component: AddEmployeeComponent, canActivate: [AuthGuard]},
  { path: 'allemployee', component: AllemployeeComponent, canActivate: [AuthGuard]},
  { path: 'employeeprofile/:id', component: EmployeeprofileComponent, canActivate: [AuthGuard]},
  { path: 'attendance', component: AttendanceComponent, canActivate: [AuthGuard]},
  { path: 'attendance-list', component: AttendanceListComponent }
];
