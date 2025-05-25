import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { TestFormComponent } from './test-form/test-form.component';

export const routes: Routes = [
    {
    path: 'test-form',
    component: TestFormComponent // 👈 Temporary test route
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { role: 'admin' },
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: '',
    redirectTo: 'auth/signin',
    pathMatch: 'full',
  }
];
