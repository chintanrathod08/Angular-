import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MatFormField } from '@angular/material/input';
import { Da }

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormField,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
