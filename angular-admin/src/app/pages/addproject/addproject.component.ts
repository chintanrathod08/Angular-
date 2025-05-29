import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-addproject',
  standalone: true,
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
    MatRadioModule,
    NgClass
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './addproject.component.html',
  styleUrl: './addproject.component.scss'
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
      alert('Please fill all required fields');
      return;
    }

    const data = this.addProjectForm.value;

    if (this.isEditMode && this.editId !== null) {
      this.projectService.updateProject(this.editId, data).subscribe(() => {
        alert('Project updated successfully ✅');
        this.router.navigate(['/allproject']);
      });
    } else {
      this.projectService.postData(data).subscribe(() => {
        alert('Project added successfully ✅');
        this.router.navigate(['/allproject']);
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/allproject']);
  }

  getStatusClass(value: string): string {
  const selected = this.addProjectForm.get('status')?.value;
  return selected === value ? value.toLowerCase().replace(' ', '-') + '-bg' : '';
  }


}
