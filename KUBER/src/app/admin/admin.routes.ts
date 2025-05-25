// File: src/app/admin/admin.routes.ts
import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AllProjectsComponent } from './projects/all-projects.component';
import { AddProjectComponent } from './projects/add-project.component';
import { ProjectDetailsComponent } from './projects/project-details.component';
import { EstimatesComponent } from './projects/estimates.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'projects/all', component: AllProjectsComponent },
      { path: 'projects/add', component: AddProjectComponent },
      { path: 'projects/details/:id', component: ProjectDetailsComponent },
      { path: 'projects/estimates', component: EstimatesComponent },
    ],
  }
];
