import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { MatIconModule } from '@angular/material/icon';
import { Project } from '../../project';
import { CommonModule } from '@angular/common';
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
    MatButtonModule],
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

  

}
