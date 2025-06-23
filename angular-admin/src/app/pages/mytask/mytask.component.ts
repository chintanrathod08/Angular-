import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, NgModelGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';

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
    DatePipe,
  ],
  templateUrl: './mytask.component.html',
  styleUrls: ['./mytask.component.scss']
})
export class MytaskComponent implements AfterViewInit {
  displayedColumns: string[] = ['position', 'title', 'priority', 'taskdate', 'duedate', 'status', 'action'];
  dataSource = new MatTableDataSource<any>();
  currentUser: any;
  searchText: string = '';


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngAfterViewInit() {
    this.loadTasks();
    this.dataSource.paginator = this.paginator;
  }

  // laodTask
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
            taskdate: this.parseDate(task.taskdate),
            duedate: this.parseDate(task.duedate),
            completed: task.completed,
            assignedName: task.assignedName
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
        const [day, month, year] = dateString.split('/');
        return new Date(+year, +month - 1, +day);
      } else if (dateString.includes('-')) {
        return new Date(dateString);
      }
    }

    return new Date(dateString); // Fallback
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
  async toggleCompletion(event: MatCheckboxChange, task: any) {
    // Don't use preventDefault() - it's not needed with (change)

    try {
      // Create updated task with toggled completion status
      const updatedTask = {
        ...task,
        completed: event.checked
      };

      // Update the task in the backend
      await this.taskService.updateTask(task.id, updatedTask).toPromise();

      // Update the local data source immutably
      const index = this.dataSource.data.findIndex(t => t.id === task.id);
      if (index !== -1) {
        const newData = [...this.dataSource.data];
        newData[index] = updatedTask;
        this.dataSource.data = newData;
      }
    } catch (error) {
      console.error('Error updating task:', error);
      // Revert the checkbox state if update fails
      event.source.checked = !event.checked;
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

    const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, '');

    const search = normalize(this.searchText);

    return data.filter(record =>
      normalize(record.title).includes(search) ||
      normalize(record.priority).includes(search) ||
      (
        record.duedate instanceof Date
          ? normalize(record.duedate.toLocaleDateString('en-GB')).includes(search)
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

  onView(id: number) {
    console.log("Viewing task with ID :", id)
    this.router.navigate(['viewtask', id])
  }
}