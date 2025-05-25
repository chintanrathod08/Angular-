import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/dashboard.component';  // fixed import path
import { AuthGuard } from '../auth/auth.guard';

import { AdminComponent } from './pages/admin/admin.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { ClientComponent } from './pages/client/client.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard],
        data: { roles: ['admin'] }  // lowercase
      },
      {
        path: 'employee',
        component: EmployeeComponent,
        canActivate: [AuthGuard],
        data: { roles: ['employee'] }  // lowercase
      },
      {
        path: 'client',
        component: ClientComponent,
        canActivate: [AuthGuard],
        data: { roles: ['client'] }  // lowercase
      },
      {
        path: '',
        redirectTo: 'admin',  // or choose default route dynamically later
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
