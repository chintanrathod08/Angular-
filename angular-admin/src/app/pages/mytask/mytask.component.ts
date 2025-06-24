import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TaskFormDialogComponent } from '../task-form-dialog/task-form-dialog.component';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

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
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './mytask.component.html',
  styleUrls: ['./mytask.component.scss'],
  providers: [
    provideNativeDateAdapter(),
  ]
})
export class MytaskComponent implements AfterViewInit {
  displayedColumns: string[] = ['position', 'title', 'priority', 'taskdate', 'duedate', 'status', 'action'];
  dataSource = new MatTableDataSource<any>();
  currentUser: any;
  searchText: string = '';
  priorityList = ['High', 'Normal', 'Low'];
  employees = []; // Populate this with your employees data
  addTaskForm: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.addTaskForm = this.fb.group({
      title: ['', Validators.required],
      assignedTo: ['', Validators.required],
      clientname: ['', Validators.required],
      priority: ['', Validators.required],
      taskdate: [''],
      duedate: [''],
      eventdetails: ['']
    });
  }

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
            taskdate: this.parseDate(task.taskdate),
            duedate: this.parseDate(task.duedate),
            completed: task.completed,
            assignedName: task.assignedName,
            clientname: task.clientname,
            eventdetails: task.eventdetails,
            assignedTo: task.assignedTo
          }));
        },
        error: (err) => {
          console.error('Error loading tasks:', err);
        }
      });
    }
  }

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

    return new Date(dateString);
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

  async toggleCompletion(event: MatCheckboxChange, task: any) {
    try {
      const updatedTask = {
        ...task,
        completed: event.checked
      };

      await this.taskService.updateTask(task.id, updatedTask).toPromise();

      const index = this.dataSource.data.findIndex(t => t.id === task.id);
      if (index !== -1) {
        const newData = [...this.dataSource.data];
        newData[index] = updatedTask;
        this.dataSource.data = newData;
      }
    } catch (error) {
      console.error('Error updating task:', error);
      event.source.checked = !event.checked;
    }
  }

  onEdit(taskId: number) {
    const task = this.dataSource.data.find(t => t.id === taskId);
    if (task) {
      const dialogRef = this.dialog.open(TaskFormDialogComponent, {
        width: '600px',
        data: {
          form: this.addTaskForm,
          employees: this.employees,
          priorityList: this.priorityList,
          isEdit: true,
          currentAssignedName: task.assignedName
        }
      });

      this.addTaskForm.patchValue({
        title: task.title,
        assignedTo: task.assignedTo,
        clientname: task.clientname,
        priority: task.priority,
        taskdate: task.taskdate,
        duedate: task.duedate,
        eventdetails: task.eventdetails
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.updateTask(taskId,{
            ...result,
            assignedName: task.assignedName
          });
        } else {
          this.addTaskForm.reset();
        }
      });
    }
  }

  updateTask(taskId: number, updatedData: any) {
    this.taskService.updateTask(taskId, updatedData).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (err) => {
        console.error('Error updating task:', err);
      }
    });
  }

  get totalTasks(): number {
    return this.dataSource?.data?.length || 0;
  }

  get completedTasks(): number {
    return this.dataSource?.data?.filter(task => task.completed)?.length || 0;
  }

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

  sortByPriority(priority: 'High' | 'Normal' | 'Low') {
    const priorityOrder: Record<string, number> = {
      High: 3,
      Normal: 2,
      Low: 1
    };

    const isAscending = priority === 'Low';

    const sorted = [...this.dataSource.data].sort((a, b) =>
      isAscending
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority]
    );

    this.dataSource.data = sorted;
  }

  onView(id: number) {
    console.log("Viewing task with ID:", id);
    this.router.navigate(['viewtask', id]);
  }
}