import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import components
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './pages/home/home.component'; 
import { AddprojectComponent } from './pages/addproject/addproject.component';
import { AllprojectComponent } from './pages/allproject/allproject.component';
import { EstimatesComponent } from './pages/estimates/estimates.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { AddEmployeeComponent } from './pages/addemployee/addemployee.component';
import { AllemployeeComponent } from './pages/allemployee/allemployee.component';
import { EmployeeprofileComponent } from './pages/employeeprofile/employeeprofile.component';
import { AttendanceListComponent } from './pages/attendance-list/attendance-list.component';

import { AuthGuard } from './guards/auth.guard';
import { TaskComponent } from './pages/task/task.component';
import { MytaskComponent } from './pages/mytask/mytask.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Public routes
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // Admin only routes
  {
    path: 'addproject',
    component: AddprojectComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'addemployee',
    component: AddEmployeeComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'allemployee',
    component: AllemployeeComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'allproject',
    component: AllprojectComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'estimate',
    component: EstimatesComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'projectdetails/:id',
    component: ProjectDetailsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'attendance-list',
    component: AttendanceListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'task',
    component: TaskComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },

  // employee only routes
  {
    path: 'mytask',
    component: MytaskComponent,
    canActivate: [AuthGuard],
    data: { roles: ['employee'] }
  },

  // Routes accessible by admin and employee
  {
    path: 'attendance',
    component: AttendanceComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'employee'] }
  },
  {
    path: 'employeeprofile/:id',
    component: EmployeeprofileComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'employee'] }
  },

  // Home route accessible by admin and employee
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'employee'] }
  },

  // Wildcard fallback
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
