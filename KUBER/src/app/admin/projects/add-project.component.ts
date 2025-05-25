import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule],
  template: `
    <div class="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h1 class="text-2xl font-bold mb-6">Add New Project</h1>
      <form (ngSubmit)="onSubmit()" #projectForm="ngForm">
        <mat-form-field class="w-full mb-4">
          <input
            matInput
            placeholder="Project Name"
            required
            name="name"
            [(ngModel)]="project.name"
          />
        </mat-form-field>

        <mat-form-field class="w-full mb-4">
          <input
            matInput
            placeholder="Client"
            required
            name="client"
            [(ngModel)]="project.client"
          />
        </mat-form-field>

        <mat-form-field class="w-full mb-4">
          <input
            matInput
            placeholder="Status"
            required
            name="status"
            [(ngModel)]="project.status"
          />
        </mat-form-field>

        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="projectForm.invalid"
          class="w-full"
        >
          Add Project
        </button>
      </form>
    </div>
  `,
})
export class AddProjectComponent {
  project = {
    name: '',
    client: '',
    status: '',
  };

  constructor(private router: Router) {}

  onSubmit() {
    // TODO: Send project to backend or JSON server
    console.log('New Project:', this.project);
    alert('Project added successfully!');

    // Redirect back to All Projects page
    this.router.navigate(['/admin/projects/all']);
  }
}
