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
import Swal from 'sweetalert2';

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

  //delete
  onDelete(id: number) {
    // ✅ Confirmation dialog with SweetAlert2
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this Elpoyee! This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete it! 🗑️",
      cancelButtonText: "Cancel",
      reverseButtons: true
    }).then((result) => {
      // ✅ Only delete if user confirms
      if (result.isConfirmed) {
        // Show loading state
        Swal.fire({
          title: 'Deleting...',
          text: 'Please wait while we delete the project.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // ✅ Actual delete operation
        this.employeeService.deleteEmployee(id).subscribe({
          next: () => {
            // ✅ Success toast notification
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
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
              title: "Employee deleted successfully!"
            });

            this.getAllData(); // Refresh list
          },
          error: (err) => {
            console.error('Error deleting project', err);

            // ❌ Error notification
            Swal.fire({
              title: "Error!",
              text: "Failed to delete Employee. Please try again.",
              icon: "error",
              confirmButtonText: "OK"
            });
          }
        });
      }
    });
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
  get filteredRecords(): Employees[] {
    if (!this.searchText) return this.epApiData;
    const search = this.searchText.toLowerCase();
    return this.epApiData.filter(record =>
      record.firstName.toLowerCase().includes(search)
    );
  }

}