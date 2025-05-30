import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; 
import { ProjectService } from '../../services/project.service';
import { Project } from '../../project';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatProgressBarModule], 
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent implements OnInit {

  projectData?: Project;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
      this.projectService.getDataByID(id).subscribe({
      next: (res) =>{
        this.projectData = res;
      }
    })
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



}
