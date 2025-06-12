import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { Employees } from '../../model/employee';
import { EmployeeService } from '../../services/employee.service';
import { CommonModule, NgClass } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';


@Component({
  standalone: true,
  selector: 'app-allemployee',
  imports: [
    MatIconModule,
    RouterLink,
    MatTableModule,
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    FormsModule
  ],

  templateUrl: './allemployee.component.html',
  styleUrl: './allemployee.component.scss'
})

export class AllemployeeComponent implements OnInit {

  epApiData: Employees[] = [];

  searchText: string = '';
  firstName!: string;

  constructor(private employeeService: EmployeeService, private router: Router) { }

  ngOnInit(): void {
    this.getAllData();
  }

  getAllData() {
    this.employeeService.getData().subscribe(res => {
      this.epApiData = res;
    })
  }

  onView(id: number) {
    console.log("Viewing employee with ID :", id);
    this.router.navigate(['employeeprofile', id])
  }

  onUpdate(id: number) {
    this.router.navigate(['/addemployee'], { queryParams: { editId: id } });
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this employee? 🗑️')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          alert('Employee deleted successfully ✅');
          this.getAllData();
        },
        error: (err) => {
          console.log('Error deleting Employee', err);
        }
      })
    }
  }

  // gender
  getGenderClass(gender: string): string {
    switch (gender) {
      case 'Male': return 'text-green-600 bg-green-100 p-2 rounded-md';
      case 'Female': return 'text-purple-600 bg-purple-100 p-2 rounded-md';
      default: return '';
    }
  }

  //search
  get filteredRecords(): Employees[]{
    if (!this.searchText) return this.epApiData;
    const search = this.searchText.toLowerCase();
    return this.epApiData.filter(record =>
      record.firstName.toLowerCase().includes(search)
    );
  }

}