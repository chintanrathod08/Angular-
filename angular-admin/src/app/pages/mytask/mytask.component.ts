import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, NgModelGroup } from '@angular/forms';
import { Tasks } from '../../model/tasks';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-mytask',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule,
    FormsModule,
    MatButtonModule,
    MatMenuModule,
    DatePipe // This is the critical addition
  ],
  templateUrl: './mytask.component.html',
  styleUrls: ['./mytask.component.scss']
})
export class MytaskComponent implements AfterViewInit {
  displayedColumns: string[] = ['position', 'title', 'priority', 'duedate', 'status'];
  dataSource = new MatTableDataSource<any>();
  currentUser: any;
  searchText: string = '';


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

  // priority - color
  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Low': return 'text-green-500';
      case 'Normal': return 'text-blue-500';
      case 'High': return 'text-red-500';
      default: return '';
    }
  }

  // priority - icon
  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'Low': return 'arrow_downward';
      case 'Normal': return 'remove';
      case 'High': return 'arrow_upward';
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


  // searching 
  get filteredRecords(): any[] {
    const data = this.dataSource?.data || [];

    if (!this.searchText) return data;

    const search = this.searchText.toLowerCase();

    return data.filter(record =>
      record.title.toLowerCase().includes(search) ||
      record.priority.toLowerCase().includes(search) ||
      (
        record.duedate instanceof Date
          ? record.duedate.toLocaleDateString('en-GB').toLowerCase().includes(search)
          : false
      )
    );
  }

    // sorting 
  sortByPriority(priority: 'High' | 'Normal' | 'Low') {
    const priorityOrder: Record<string, number> = {
      High: 3,
      Normal: 2,
      Low: 1
    };

    const isAscending = priority === 'Low'; // Low → High, others → High → Low

    const sorted = [...this.dataSource.data].sort((a, b) =>
      isAscending
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority]
    );

    this.dataSource.data = sorted;
  }

}