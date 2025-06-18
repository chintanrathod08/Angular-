import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-mytask',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule,
    DatePipe // This is the critical addition
  ],
  templateUrl: './mytask.component.html',
  styleUrls: ['./mytask.component.scss']
})
export class MytaskComponent implements AfterViewInit {
  displayedColumns: string[] = ['position', 'title', 'priority', 'duedate', 'status'];
  dataSource = new MatTableDataSource<any>();
  currentUser: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) { }

  ngAfterViewInit() {
    this.loadTasks();
    this.dataSource.paginator = this.paginator;
  }

  loadTasks() {
    this.currentUser = this.authService.getUser();
    if (this.currentUser) {
      this.taskService.getTasks().subscribe({
        next: (tasks) => {
          this.dataSource.data = tasks.map((task, index) => ({
            position: index + 1,
            id: task.id,
            title: task.title,
            priority: task.priority,
            duedate: this.parseDate(task.duedate), // Parse date here
            completed: task.completed
          }));
        },
        error: (err) => {
          console.error('Error loading tasks:', err);
        }
      });
    }
  }

  // Add this method to parse dates
  parseDate(dateString: string | Date): Date {
    if (dateString instanceof Date) {
      return dateString;
    }

    if (typeof dateString === 'string') {
      if (dateString.includes('/')) {
        // Handle DD/MM/YYYY format
        const [day, month, year] = dateString.split('/');
        return new Date(+year, +month - 1, +day);
      } else if (dateString.includes('-')) {
        // Handle YYYY-MM-DD format
        return new Date(dateString);
      }
    }

    return new Date(); // Fallback
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Low': return 'text-green-500';
      case 'Normal': return 'text-blue-500';
      case 'High': return 'text-red-500';
      default: return '';
    }
  }



  // Add this method to properly toggle task completion
  async toggleCompletion(task: any) {
    // Create updated task object
    const updatedTask = {
      ...task,
      completed: !task.completed
    };

    try {
      // Update the task on the server
      await this.taskService.updateTask(task.id, updatedTask).toPromise();

      // Update local data
      const updatedData = this.dataSource.data.map(t =>
        t.id === task.id ? updatedTask : t
      );
      this.dataSource.data = updatedData;

    } catch (error) {
      console.error('Error updating task:', error);
      // Revert the checkbox if update fails
      task.completed = !task.completed;
    }
  }

  // Add these properties to your component class
  get totalTasks(): number {
    return this.dataSource?.data?.length || 0;
  }

  get completedTasks(): number {
    return this.dataSource?.data?.filter(task => task.completed)?.length || 0;
  }

}