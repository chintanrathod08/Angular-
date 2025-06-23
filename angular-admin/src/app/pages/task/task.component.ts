import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
    this.initializeForm();
    this.getTaskList();
    this.loadEmployees();
    this.handleEditMode();
  }

  initializeForm(): void {
    this.addTaskForm = this.fb.group({
      title: ['', Validators.required],
      assignedTo: ['', Validators.required],
      assignedName: [''],
      clientname: ['', Validators.required],
      priority: ['', Validators.required],
      taskdate: [new Date(), Validators.required],
      duedate: ['', [Validators.required, this.validateDueDate.bind(this)]],
      eventdetails: ['', Validators.required],
      completed: [false]
    });
  }

  handleEditMode(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['editId']) {
        this.isEditMode = true;
        this.editId = +params['editId'];
        this.taskService.getTaskById(this.editId).subscribe((task) => {
          const formattedTask = {
            ...task,
            taskdate: this.parseDate(task.taskdate),
            duedate: this.parseDate(task.duedate)
          };
          this.addTaskForm.patchValue(formattedTask);
          this.toggleTaskMenu();
        });
      }
    });
  }

  validateDueDate(control: AbstractControl): ValidationErrors | null {
    const taskDate = this.addTaskForm?.get('taskdate')?.value;
    const dueDate = control.value;

    if (taskDate && dueDate && new Date(dueDate) < new Date(taskDate)) {
      return { invalidDueDate: true };
    }
    return null;
  }

  // In both components, ensure consistent date parsing
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

  formatDate(date: Date | string | null | undefined): string {
    if (!date) return '';

    // If already formatted in YYYY-MM-DD, return as-is
    if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return date;
    }

    // If in dd/mm/yyyy format, convert to Date object first
    if (typeof date === 'string' && date.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const [day, month, year] = date.split('/');
      date = new Date(+year, +month - 1, +day);
    }

    // Handle Date objects and other string formats
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return ''; // Invalid date

    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
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

  onSubmit(): void {
    if (this.addTaskForm.invalid) {
      this.showError('Please fill all required fields');
      return;
    }

    const formData = this.prepareFormData();
    const request$ = this.isEditMode && this.editId !== null
      ? this.taskService.updateTask(this.editId, formData)
      : this.taskService.postData(formData);

    request$.subscribe({
      next: () => this.handleSuccess(),
      error: (err) => this.handleError(err)
    });
  }


  prepareFormData(): any {
    const selectedEmployee = this.employees.find(emp => emp.id === this.addTaskForm.value.assignedTo);

    return {
      ...this.addTaskForm.value,
      assignedTo: selectedEmployee?.id,
      assignedName: selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : '',
      taskdate: this.formatDate(this.addTaskForm.value.taskdate),
      duedate: this.formatDate(this.addTaskForm.value.duedate),
    };
  }

  showError(message: string): void {
    Swal.fire({
      toast: true,
      icon: 'error',
      title: message,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }

  handleSuccess(): void {
    const successMessage = this.isEditMode ? 'Task updated successfully' : 'Task added successfully';
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
    this.addTaskForm.reset({
      taskdate: new Date()
    });
    this.isEditMode = false;
    this.editId = null;
    this.isTaskMenuOpen = false;
  }

  handleError(error: any): void {
    console.error('Error:', error);
    Swal.fire({
      title: 'Error!',
      text: 'An error occurred. Please try again.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }

  getTaskList() {
    this.taskService.getTasks().subscribe((data) => {
      this.taskRecord = data.map(task => ({
        ...task,
        completed: task.completed ?? false,
        taskdate: this.formatDate(task.taskdate),
        duedate: this.formatDate(task.duedate)
      }));
    });
  }

  toggleTaskMenu(): void {
    this.isTaskMenuOpen = !this.isTaskMenuOpen;
    if (!this.isTaskMenuOpen) {
      this.isEditMode = false;
      this.editId = null;
      this.addTaskForm.reset({
        taskdate: new Date()
      });
    }
    setTimeout(() => {
      this.updateMaterialFormFieldAppearance();
    });
  }

  onEdit(id: number) {
    this.isEditMode = true;
    this.editId = id;
    this.taskService.getTaskById(id).subscribe((task) => {
      this.addTaskForm.patchValue({
        ...task,
        taskdate: this.parseDate(task.taskdate),
        duedate: this.parseDate(task.duedate)
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

  onView(id: number) {
    console.log("Viewing task with ID :", id);
    this.router.navigate(['viewtask', id])
  }

  toggleCompletion(task: Tasks) {
    task.completed = !task.completed;

    const updatedTask: Tasks = {
      id: task.id,
      title: task.title ?? '',
      assignedTo: task.assignedTo ?? 0,
      assignedName: task.assignedName ?? '',
      clientname: task.clientname ?? '',
      priority: task.priority ?? 'Normal',
      taskdate: this.formatDate(task.taskdate),
      duedate: this.formatDate(task.duedate),
      eventdetails: task.eventdetails ?? '',
      completed: task.completed
    };

    console.log('Final Updated Task being sent:', updatedTask);

    this.taskService.updateTask(task.id!, updatedTask).subscribe(() => {
      this.getTaskList();
    });
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

  updateMaterialFormFieldAppearance(): void {
    this.matFormFields?.forEach(field => {
      (field as any)._elementRef.nativeElement.classList.remove('mat-form-field-appearance-outline');
      (field as any)._control?.ngControl?.control?.markAsTouched?.();
      (field as any)._control?.ngControl?.control?.updateValueAndValidity?.();
    });
  }

  // serching
  get filteredRecords(): Tasks[] {
    if (!this.searchText) return this.taskRecord;

    // Normalize input: lowercase and remove spaces
    const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, '');
    const search = normalize(this.searchText);

    return this.taskRecord.filter(record =>
      normalize(record.title).includes(search) ||
      normalize(record.priority).includes(search) ||
      (record.assignedName && normalize(record.assignedName).includes(search))
    );
  }

  get totalTasks(): number {
    return this.taskRecord.length;
  }

  get completedTasks(): number {
    return this.taskRecord.filter(task => task.completed).length;
  }

  // sorting
  sortByPriority(priority: 'High' | 'Normal' | 'Low') {
    const priorityOrder: Record<string, number> = {
      High: 3,
      Normal: 2,
      Low: 1
    };

    const isAscending = priority === 'Low';

    const sorted = [...this.taskRecord].sort((a, b) =>
      isAscending
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority]
    );

    this.taskRecord = sorted;
  }
}