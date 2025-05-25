import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsRoutingModule } from './projects-routing.module';

import { AllProjectsComponent } from './all-projects/all-projects.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AllProjectsComponent,
    AddProjectComponent,
    ProjectDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProjectsRoutingModule
  ]
})
export class ProjectsModule {}
