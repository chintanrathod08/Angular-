import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';
import { AdminComponent } from './dashboard/pages/admin/admin.component';
import { ClientComponent } from './dashboard/pages/client/client.component';
import { EmployeeComponent } from './dashboard/pages/employee/employee.component';
import { LastValueFromConfig } from 'rxjs/internal/lastValueFrom';
import { LayoutComponent } from './dashboard/layout/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },

  {
    path: 'dashboard',
    component: LayoutComponent  ,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'admin' }
      },
      {
        path: 'client',
        component: ClientComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'client' }
      },
      {
        path: 'employee',
        component: EmployeeComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'employee' }
      }
    ]
  }
];
