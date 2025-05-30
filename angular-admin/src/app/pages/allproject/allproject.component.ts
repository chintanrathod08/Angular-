import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { MatIconModule } from '@angular/material/icon';
import { Project } from '../../project';
import { CommonModule, NgClass } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-allproject',
  imports: [CommonModule,
    MatIconModule,
    MatProgressBarModule,
    RouterLink,
    MatProgressBarModule,
    MatMenuModule,
    MatButtonModule,
    NgClass
  ],
  templateUrl: './allproject.component.html',
  styleUrl: './allproject.component.scss'
})


export class AllprojectComponent implements OnInit {

  apiData: Project[] = [];

  constructor(private projectService: ProjectService, private router: Router) { }

  ngOnInit(): void {
    this.getAllData();
  }

  getAllData() {
    this.projectService.getData().subscribe(res => {
      this.apiData = res;
    })
  }

  onView(id: number) {
    console.log("Viewing project with ID:", id);
    this.router.navigate(['projectdetails', id])
  }

  onUpdate(id: number) {
    this.router.navigate(['/addproject'], { queryParams: { editId: id } });
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          alert('Project deleted successfully 🗑️');
          this.getAllData(); // Refresh list
        },
        error: (err) => {
          console.error('Error deleting project', err);
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active': return 'bg-blue-800';
      case 'Completed': return 'bg-green-600';
      case 'Running': return 'bg-yellow-400 text-black';
      case 'Pending': return 'bg-gray-500';
      case 'Not Started': return 'bg-black';
      case 'Cancelled':
      case 'Cancled': return 'bg-red-600';
      default: return 'bg-gray-400';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Low': return 'text-green-500';
      case 'Medium': return 'text-blue-500';
      case 'High': return 'text-red-500';
      default: return '';
    }
  }

  getPriorityIcon(priority: string): string {
   switch (priority) {
    case 'Low': return 'keyboard_arrow_down';
    case 'Medium': return 'code';
    case 'High': return 'keyboard_arrow_up';
    default: return '';
  }

}

}
