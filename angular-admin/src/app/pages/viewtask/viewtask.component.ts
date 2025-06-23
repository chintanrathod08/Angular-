import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Tasks } from '../../model/tasks';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-viewtask',
  standalone: true,
  imports: [
    MatIconModule,
    NgIf,
    CommonModule,
    RouterLink,
    NgClass
  ],
  templateUrl: './viewtask.component.html',
  styleUrl: './viewtask.component.scss'
})
export class ViewtaskComponent implements OnInit {
  taskData?: Tasks; // No default values
  isAdminUser: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router,
    private authService: AuthService
  ) {
    this.isAdminUser = this.authService.isAdmin();
  }

  ngOnInit(): void {
    this.loadTaskData();
  }

  loadTaskData(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.taskService.getTaskById(id).subscribe({
        next: (res) => {
          this.taskData = res; // Assign raw API data directly
          // Only format dates
          if (this.taskData) {
            this.taskData.taskdate = this.formatDate(res.taskdate);
            this.taskData.duedate = this.formatDate(res.duedate);
            console.log("Raw task from API:", res);
          }
        },
        error: (err) => {
          console.error('Error fetching task:', err);
        }
      });
    }
  }

  formatDate(date: any): string {
    if (!date) return ''; // Return empty if no date
    if (typeof date === 'string') {
      if (date.match(/^\d{2}\/\d{2}\/\d{4}$/)) return date;
      const d = new Date(date);
      return isNaN(d.getTime()) ? date : d.toLocaleDateString('en-GB');
    }
    return new Date(date).toLocaleDateString('en-GB');
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Low': return 'text-green-500';
      case 'Normal': return 'text-blue-500';
      case 'High': return 'text-red-500';
      default: return '';
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'Low': return 'arrow_downward';
      case 'Normal': return 'remove';
      case 'High': return 'arrow_upward';
      default: return '';
    }
  }
}