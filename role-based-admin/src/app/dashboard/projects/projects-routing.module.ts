import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AllProjectsComponent } from './all-projects/all-projects.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';

const routes: Routes = [
  { path: '', component: AllProjectsComponent },           // /dashboard/projects
  { path: 'add', component: AddProjectComponent },         // /dashboard/projects/add
  { path: ':id', component: ProjectDetailsComponent },     // /dashboard/projects/123
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {}
