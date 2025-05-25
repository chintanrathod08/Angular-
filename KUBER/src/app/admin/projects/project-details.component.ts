import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Project {
  id: number;
  name: string;
  client: string;
  status: string;
  description?: string;
}

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <button (click)="goBack()" class="mb-4 text-blue-600 hover:underline">&larr; Back</button>
      <h1 class="text-3xl font-bold mb-4">Project Details</h1>
      <div *ngIf="project; else noData">
        <p><strong>ID:</strong> {{ project.id }}</p>
        <p><strong>Name:</strong> {{ project.name }}</p>
        <p><strong>Client:</strong> {{ project.client }}</p>
        <p><strong>Status:</strong> {{ project.status }}</p>
        <p><strong>Description:</strong> {{ project.description || 'N/A' }}</p>
      </div>
      <ng-template #noData>
        <p>Project not found.</p>
      </ng-template>
    </div>
  `,
})
export class ProjectDetailsComponent implements OnInit {
  project: Project | undefined;
  projects: Project[] = [
    { id: 1, name: 'Project Alpha', client: 'Client A', status: 'Ongoing', description: 'Description for Alpha' },
    { id: 2, name: 'Project Beta', client: 'Client B', status: 'Completed', description: 'Description for Beta' },
    { id: 3, name: 'Project Gamma', client: 'Client C', status: 'Pending', description: 'Description for Gamma' },
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.project = this.projects.find(p => p.id === id);
  }

  goBack() {
    this.router.navigate(['/admin/projects/all']);
  }
}
