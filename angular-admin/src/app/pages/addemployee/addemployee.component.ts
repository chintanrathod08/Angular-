import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    NgFor,
    MatIcon
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './addemployee.component.html',
  styleUrl: './addemployee.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AddEmployeeComponent implements OnInit {
  addemployeeForm!: FormGroup;
  isEditMode: boolean = false;
  editId: number | null = null;
  genderList = ['Male', 'Female'];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.addemployeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      mobile: ['', Validators.required],
      password: ['', Validators.required],
      rePassword: ['', Validators.required],
      department: ['', Validators.required],
      designation: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', Validators.required],
      education: ['', Validators.required],
      joindate: ['', Validators.required],
      skills: ['', Validators.required],
      experience: ['', Validators.required],
      location: ['', Validators.required],
      about: ['', Validators.required],
      role: ['employee'],
      file: [null]
    });

    this.route.queryParams.subscribe(params => {
      if (params['editId']) {
        this.isEditMode = true;
        this.editId = +params['editId'];
        this.loadEmployee(this.editId);
      }
    });
  }

  loadEmployee(id: number): void {
    this.employeeService.getDataByID(id).subscribe(employee => {
      this.addemployeeForm.patchValue({
        ...employee,
        dob: new Date(employee.dob),
        joindate: new Date(employee.joindate)
      });
    });
  }

  onSubmit(): void {
    if (this.addemployeeForm.invalid) {
      alert('Please fill all required fields ❌');
      return;
    }

    const data = this.addemployeeForm.value;

    if (data.password !== data.rePassword) {
      alert('Passwords do not match ❌');
      return;
    }

    if (this.isEditMode && this.editId !== null) {
      this.employeeService.updateEmployee(this.editId, data).subscribe(() => {
        alert('Employee updated successfully ✅');
        this.router.navigate(['/allemployee']);
      });
    } else {
      this.employeeService.postData(data).subscribe(() => {
        alert('Employee added successfully ✅');
        this.router.navigate(['/allemployee']);
      });
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.addemployeeForm.patchValue({ file: reader.result as string });
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file ❌');
    }
  }

  onCancel(): void {
    this.addemployeeForm.reset();
  }

  getGenderClass(gender: string): string {
    const selected = this.addemployeeForm.get('gender')?.value;
    if (selected !== gender) return '';

    switch (gender) {
      case 'Male': return 'text-green-600 bg-green-100 p-2 rounded-md';
      case 'Female': return 'text-purple-600 bg-purple-100 p-2 rounded-md';
      default: return '';
    }
  }
}
