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
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Router } from '@angular/router';
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

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.addemployeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      gender: ['', Validators.required],
      mobile: ['', Validators.required],
      password: ['', Validators.required],
      rePassword: ['', Validators.required],
      department: ['', Validators.required],
      designation: [''],
      address: [''],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', Validators.required],
      education: [''],
      joindate: ['', Validators.required],
      skills: ['', Validators.required],
      experience: ['', Validators.required],
      location: ['', Validators.required],
      about: [''],
      file: [null]
    });

    // check if it's update modde
    this.route.queryParams.subscribe(params => {
      if (params['editId']) {
        this.isEditMode = true;
        this.editId = +params['editId'];
        this.loadProject(this.editId)
      }
    })
  }

  loadProject(id: number) {
    this.employeeService.getDataByID(id).subscribe(employee => {
      this.addemployeeForm.patchValue({
        ...employee,
        dob: new Date(employee.dob),
        joindate: new Date(employee.joindate)
      })
    })
  }

  onSubmit(): void {
    if (this.addemployeeForm.invalid) {
      alert('Please fill all required fields ❌');
      return;
    }

    const data = this.addemployeeForm.value;

    if (this.isEditMode && this.editId !== null) {
      this.employeeService.updateEmployee(this.editId, data).subscribe(() => {
        alert('Project update successfully ✅');
        this.router.navigate(['/allemployee'])
      });
    } else {
      this.employeeService.postData(data).subscribe(() => {
        alert('Project added successfully ✅');
        this.router.navigate(['/allemployee'])
      })
    }

  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.addemployeeForm.patchValue({ file: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

  onCancel() {
    this.addemployeeForm.reset();
  }

  //gender

  genderList = ['Male', 'Female'];

  getGenderClass(gender: string): string {
    const select = this.addemployeeForm.get('gender')?.value;
    if (select !== gender) return '';

    switch (gender) {
      case 'Male': return 'text-green-600 bg-green-100 p-2 rounded-md';
      case 'Female': return 'text-purple-600 bg-purple-100 p-2 rounded-md';
      default: return '';
    }
  }

}
