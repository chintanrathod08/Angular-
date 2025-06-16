import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AddprojectComponent } from './pages/addproject/addproject.component';
import { AllemployeeComponent } from './pages/allemployee/allemployee.component';
import { EstimatesComponent } from './pages/estimates/estimates.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { HomeComponent } from './pages/home/home.component';
import { AllprojectComponent } from './pages/allproject/allproject.component';
import { AttendanceListComponent } from './pages/attendance-list/attendance-list.component';
import { AddEmployeeComponent } from './pages/addemployee/addemployee.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { EmployeeprofileComponent } from './pages/employeeprofile/employeeprofile.component';
import { TaskComponent } from './pages/task/task.component';
import { MytaskComponent } from './pages/mytask/mytask.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Public
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // Admin only
  { path: 'addproject', component: AddprojectComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'allemployee', component: AllemployeeComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'projectdetails/:id', component: ProjectDetailsComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'estimate', component: EstimatesComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'addemployee', component: AddEmployeeComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'employeeprofile/:id', component: EmployeeprofileComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'task', component : TaskComponent, canActivate: [AuthGuard], data: {roles: ['admin'] } }, 

  // Admin + Employee
  { path: 'allproject', component: AllprojectComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'employee'] } },
  { path: 'attendance', component: AttendanceComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'employee'] } },
  { path: 'attendance-list', component: AttendanceListComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'employee'] } },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'employee'] } },

  // Eployee only
  {path: 'mytask', component: MytaskComponent, canActivate: [AuthGuard], data: { roles: ['employee'] } },

  { path: '**', redirectTo: 'login' }
];
