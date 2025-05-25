// File: src/app/admin/layout/admin-layout.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="flex min-h-screen">
      <!-- Sidebar -->
      <nav class="w-64 bg-gray-800 text-white p-4">
        <h2 class="text-xl font-bold mb-6">Admin Panel</h2>
        <ul>
          <li class="mb-3"><a routerLink="/admin/dashboard" routerLinkActive="font-bold">Dashboard</a></li>
          <li class="mb-3"><a routerLink="/admin/projects/all" routerLinkActive="font-bold">All Projects</a></li>
          <li class="mb-3"><a routerLink="/admin/projects/add" routerLinkActive="font-bold">Add Project</a></li>
          <li class="mb-3"><a routerLink="/admin/projects/estimates" routerLinkActive="font-bold">Estimates</a></li>
        </ul>
      </nav>

      <!-- Main Content -->
      <main class="flex-1 p-6 bg-gray-100">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class AdminLayoutComponent {}
