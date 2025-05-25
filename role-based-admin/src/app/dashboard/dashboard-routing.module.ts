import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dash } from '';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'projects',
        loadChildren: () =>
          import('./projects/projects.module').then(m => m.ProjectsModule)
      },
      {
        path: '',
        redirectTo: 'projects',
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
