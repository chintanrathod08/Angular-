import { Component, ChangeDetectionStrategy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-addproject',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatButtonModule,
    RouterLink,
    NgFor,
    MatIcon
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './addproject.component.html',
  styleUrls: ['./addproject.component.scss'],
  encapsulation: ViewEncapsulation.None,
})


export class AddprojectComponent implements OnInit {

  addProjectForm!: FormGroup;
  isEditMode: boolean = false;
  editId: number | null = null;



  constructor(
    private router: Router,
    private fb: FormBuilder,
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.addProjectForm = this.fb.group({
      title: ['', Validators.required],
      department: ['', Validators.required],
      priority: ['', Validators.required],
      client: ['', Validators.required],
      price: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      team: ['', Validators.required],
      leader: ['', Validators.required],
      status: ['', Validators.required],
      description: [''],
      progress: [0]
    });

    // Check if it's update mode
    this.route.queryParams.subscribe(params => {
      if (params['editId']) {
        this.isEditMode = true;
        this.editId = +params['editId'];
        this.loadProject(this.editId);
      }
    });
  }

  loadProject(id: number) {
    this.projectService.getDataByID(id).subscribe(project => {
      this.addProjectForm.patchValue(project);
    });
  }

  onSubmit(): void {
    if (this.addProjectForm.invalid) {
      // sweetalert
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "error",
        title: "Please fill all required fields"
      });
      return;
    }

    const data = this.addProjectForm.value;

    if (this.isEditMode && this.editId !== null) {
      this.projectService.updateProject(this.editId, data).subscribe(() => {
        // alert('Project updated successfully ✅');
        const Toast = Swal.mixin({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Project updated successfully"
        });
        this.router.navigate(['/allproject']);
      });
    } else {
      this.projectService.postData(data).subscribe(() => {
        // alert('Project added successfully ✅');
        const Toast = Swal.mixin({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Project added successfully"
        });
        this.router.navigate(['/allproject']);
      });
    }

    this.router.navigate(['/allproject'], {
      queryParams: { status: data.status },
    });

  }

  onCancel(): void {
    this.router.navigate(['/allproject']);
  }

  // radio-button
  statusList = ['Active', 'Completed', 'Running', 'Pending', 'Not Started', 'Cancelled'];

  getStatusClass(status: string): string {
    const selected = this.addProjectForm.get('status')?.value;
    if (selected !== status) return '';

    switch (status) {
      case 'Active': return 'bg-blue-500';
      case 'Completed': return 'bg-green-600';
      case 'Running': return 'bg-yellow-400 text-black';
      case 'Pending': return 'bg-gray-500';
      case 'Not Started': return 'bg-black';
      case 'Cancelled': return 'bg-red-600';
      default: return '';
    }
  }

  //priority 

  priorityList = ['Low', 'Medium', 'High'];

  getPriorityClass(priority: string): string {

    const select = this.addProjectForm.get('priority')?.value;
    if (select !== priority) return '';

    switch (priority) {
      case 'Low': return 'text-green-500';
      case 'Medium': return 'text-blue-500';
      case 'High': return 'text-red-500';
      default: return '';
    }
  }

  // priority icon 
  getPriorityIcon(priority: string): string {
    const select = this.addProjectForm.get('priority')?.value;
    if (select !== priority) return '';

    switch (priority) {
      case 'Low': return '<mat-icon> keyboard_arrow_down </mat-icon> ';
      case 'Medium': return '<mat-icon>code</mat-icon>';
      case 'High': return '<mat-icon> keyboard_arrow_up </mat-icon> ';
      default: return '';
    }
  }

}