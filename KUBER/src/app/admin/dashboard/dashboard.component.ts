import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <h1 class="text-3xl font-bold mb-6">Admin Dashboard</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded shadow">
        <h2 class="text-xl font-semibold">Total Projects</h2>
        <p class="text-3xl mt-2">42</p>
      </div>
      <div class="bg-white p-6 rounded shadow">
        <h2 class="text-xl font-semibold">Active Employees</h2>
        <p class="text-3xl mt-2">15</p>
      </div>
      <div class="bg-white p-6 rounded shadow">
        <h2 class="text-xl font-semibold">Clients</h2>
        <p class="text-3xl mt-2">8</p>
      </div>
    </div>
  `,
})
export class DashboardComponent {}
