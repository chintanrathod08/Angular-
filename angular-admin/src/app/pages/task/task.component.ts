import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import Swal from 'sweetalert2';
import { TaskService } from '../../services/task.service';
import { Tasks } from '../../model/tasks';
import { Employees } from '../../model/employee';
import { EmployeeService } from '../../services/employee.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatError, MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgClass, NgIf, NgFor, DatePipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    NgClass,
    NgIf,
    NgFor,
    MatError,
    MatMenuModule,
    FormsModule,
  ],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('1.5s ease-in-out', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('1.5s ease-in-out', style({ transform: 'translateX(100%)', opacity: 0 }))
      ]),
    ])
  ]
})
export class TaskComponent implements OnInit, AfterViewInit {
  @ViewChildren(MatFormField) matFormFields!: QueryList<MatFormField>;

  isTaskMenuOpen = false;
  addTaskForm!: FormGroup;
  isEditMode = false;
  editId: number | null = null;
  taskRecord: Tasks[] = [];
  priorityList = ['Low', 'Normal', 'High'];
  employees: Employees[] = [];
  searchText: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    this.addTaskForm = this.fb.group({
      title: ['', Validators.required],
      assignedTo: ['', Validators.required],
      assignedName: [''],
      priority: ['', Validators.required],
      duedate: ['', Validators.required],
      eventdetails: ['', Validators.required],
      completed: [false]
    });

    this.getTaskList();
    this.loadEmployees();

    this.route.queryParams.subscribe((params) => {
      if (params['editId']) {
        this.isEditMode = true;
        this.editId = +params['editId'];
        this.taskService.getTaskById(this.editId).subscribe((task) => {
          this.addTaskForm.patchValue(task);
          this.toggleTaskMenu();
        });
      }
    });
  }

  ngAfterViewInit() {
    this.updateMaterialFormFieldAppearance();
  }

  loadEmployees() {
    this.employeeService.getAllEmployee().subscribe(employees => {
      this.employees = employees.map(emp => ({
        ...emp,
        name: `${emp.firstName} ${emp.lastName}`
      }));
    });
  }

  //date formate
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`; // Now returns YYYY-MM-DD format
  }

  onSubmit(): void {
    if (this.addTaskForm.invalid) {
      Swal.fire({
        toast: true,
        icon: 'error',
        title: 'Please fill all required fields',
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    const selectedEmployee = this.employees.find(emp => emp.id === this.addTaskForm.value.assignedTo);

    const formData = {
      ...this.addTaskForm.value,
      assignedTo: selectedEmployee?.id,
      assignedName: selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : '',
      duedate: this.formatDate(this.addTaskForm.value.duedate),
    };

    const request$ = this.isEditMode && this.editId !== null
      ? this.taskService.updateTask(this.editId, formData)
      : this.taskService.postData(formData);

    const successMessage = this.isEditMode ? 'Task updated successfully' : 'Task added successfully';

    request$.subscribe(() => {
      Swal.fire({
        toast: true,
        icon: 'success',
        title: successMessage,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      this.getTaskList();
      this.addTaskForm.reset();
      this.isEditMode = false;
      this.editId = null;
      this.isTaskMenuOpen = false;
    });
  }

  getTaskList() {
    this.taskService.getTasks().subscribe((data) => {
      this.taskRecord = data.map(task => ({
        ...task,
        completed: task.completed ?? false
      }));
    });
  }

  toggleTaskMenu(): void {
    this.isTaskMenuOpen = !this.isTaskMenuOpen;
    if (!this.isTaskMenuOpen) {
      this.isEditMode = false;
      this.editId = null;
      this.addTaskForm.reset();
    }
    setTimeout(() => {
      this.updateMaterialFormFieldAppearance();
    });
  }

  onEdit(id: number) {
    this.isEditMode = true;
    this.editId = id;
    this.taskService.getTaskById(id).subscribe((task) => {
      let dueDateValue: Date;
      if (typeof task.duedate === 'string') {
        if (task.duedate.includes('/')) {
          // Handle DD/MM/YYYY format
          const [day, month, year] = task.duedate.split('/');
          dueDateValue = new Date(+year, +month - 1, +day);
        } else {
          // Handle YYYY-MM-DD format
          dueDateValue = new Date(task.duedate);
        }
      } else {
        dueDateValue = new Date(task.duedate);
      }

      this.addTaskForm.patchValue({
        ...task,
        duedate: dueDateValue
      });
      this.toggleTaskMenu();
    });
  }

  onDelete(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this task! This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete it! 🗑️",
      cancelButtonText: "Cancel",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deleting...',
          text: 'Please wait while we delete the task.',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });

        this.taskService.deleteTask(id).subscribe({
          next: () => {
            Swal.fire({
              toast: true,
              icon: "success",
              title: "Task deleted successfully!",
              position: "top",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            this.getTaskList();
          },
          error: (err) => {
            console.error('Error deleting task', err);
            Swal.fire({
              title: "Error!",
              text: "Failed to delete task. Please try again.",
              icon: "error",
              confirmButtonText: "OK"
            });
          }
        });
      }
    });
  }

  toggleCompletion(task: Tasks) {
    task.completed = !task.completed;
    this.taskService.updateTask(task.id!, task).subscribe(() => {
      this.getTaskList();
    });
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

  updateMaterialFormFieldAppearance(): void {
    this.matFormFields?.forEach(field => {
      (field as any)._elementRef.nativeElement.classList.remove('mat-form-field-appearance-outline');
      (field as any)._control?.ngControl?.control?.markAsTouched?.();
      (field as any)._control?.ngControl?.control?.updateValueAndValidity?.();
    });
  }

  //search 
  get filteredRecords(): Tasks[] {
    if (!this.searchText) return this.taskRecord;
    const search = this.searchText.toLowerCase();
    return this.taskRecord.filter(record =>
      record.title.toLowerCase().includes(search) ||
      record.priority.toLowerCase().includes(search) ||
      (record.assignedName && record.assignedName.toLowerCase().includes(search))
    );
  }

  //no of task
  get totalTasks(): number {
    return this.taskRecord.length;
  }

  get completedTasks(): number {
    return this.taskRecord.filter(task => task.completed).length;
  }

  //sorting
  sortByPriority(priority: 'High' | 'Normal' | 'Low') {
    const priorityOrder: Record<string, number> = {
      High: 3,
      Normal: 2,
      Low: 1
    };

    const isAscending = priority === 'Low'; // Low → High, others → High → Low

    const sorted = [...this.taskRecord].sort((a, b) =>
      isAscending
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority]
    );

    this.taskRecord = sorted;
  }

}