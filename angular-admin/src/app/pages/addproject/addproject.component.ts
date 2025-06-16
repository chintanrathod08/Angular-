import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import Swal from 'sweetalert2';

// ✅ Correct Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';

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
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './addproject.component.html',
  styleUrls: ['./addproject.component.scss'],
})
export class AddprojectComponent implements OnInit {
  addProjectForm!: FormGroup;
  isEditMode = false;
  editId: number | null = null;

  statusList = ['Active', 'Completed', 'Running', 'Pending', 'Not Started', 'Cancelled'];
  priorityList = ['Low', 'Medium', 'High'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.addProjectForm = this.fb.group({
      title: ['', Validators.required],
      department: ['', Validators.required],
      priority: ['', Validators.required],
      client: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      team: ['', Validators.required],
      leader: ['', Validators.required],
      status: ['', Validators.required],
      description: [''],
      progress: [0],
    });

    this.route.queryParams.subscribe((params) => {
      if (params['editId']) {
        this.isEditMode = true;
        this.editId = +params['editId'];
        this.loadProject(this.editId);
      }
    });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  loadProject(id: number) {
    this.projectService.getDataByID(id).subscribe((project) => {
      const parsedProject = {
        ...project,
        startDate: project.startDate ? new Date(project.startDate) : null,
        endDate: project.endDate ? new Date(project.endDate) : null,
      };
      this.addProjectForm.patchValue(parsedProject);
    });
  }

  onSubmit(): void {
    if (this.addProjectForm.invalid) {
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

    const rawData = this.addProjectForm.value;

    const data = {
      ...rawData,
      startDate: this.formatDate(rawData.startDate),
      endDate: this.formatDate(rawData.endDate),
    };

    const request$ =
      this.isEditMode && this.editId !== null
        ? this.projectService.updateProject(this.editId, data)
        : this.projectService.postData(data);

    const successMessage = this.isEditMode ? 'Project updated successfully' : 'Project added successfully';

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

      this.router.navigate(['/allproject'], {
        queryParams: { status: data.status },
      });
    });
  }

  onCancel(): void {
    this.router.navigate(['/allproject']);
  }
}
