import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { LayoutComponent } from './layout/dashboard.component';

 import { AdminComponent } from './pages/admin/admin.component';
 import { EmployeeComponent } from './pages/employee/employee.component';
 import { ClientComponent } from './pages/client/client.component';

@NgModule({
  declarations: [
    LayoutComponent,
    AdminComponent,
    EmployeeComponent,
    ClientComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule {}
