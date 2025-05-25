import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Project {
  id: number;
  name: string;
  client: string;
  status: string;
}

@Component({
  selector: 'app-all-projects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <h1 class="text-2xl font-bold mb-4">All Projects</h1>
    <table class="min-w-full bg-white shadow rounded">
      <thead>
        <tr>
          <th class="border px-4 py-2">ID</th>
          <th class="border px-4 py-2">Project Name</th>
          <th class="border px-4 py-2">Client</th>
          <th class="border px-4 py-2">Status</th>
          <th class="border px-4 py-2">Details</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let project of projects" class="hover:bg-gray-100">
          <td class="border px-4 py-2">{{ project.id }}</td>
          <td class="border px-4 py-2">{{ project.name }}</td>
          <td class="border px-4 py-2">{{ project.client }}</td>
          <td class="border px-4 py-2">{{ project.status }}</td>
          <td class="border px-4 py-2">
            <a
              [routerLink]="['/admin/projects/details', project.id]"
              class="text-blue-600 hover:underline"
              >View</a
            >
          </td>
        </tr>
      </tbody>
    </table>
  `,
})
export class AllProjectsComponent implements OnInit {
  projects: Project[] = [];

  ngOnInit() {
    // TODO: Replace with real API call / JSON server fetch
    this.projects = [
      { id: 1, name: 'Project Alpha', client: 'Client A', status: 'Ongoing' },
      { id: 2, name: 'Project Beta', client: 'Client B', status: 'Completed' },
      { id: 3, name: 'Project Gamma', client: 'Client C', status: 'Pending' },
    ];
  }
}
