import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { MatIconModule } from '@angular/material/icon';
import { Project } from '../../model/project';
import { CommonModule, NgClass } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-allproject',
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressBarModule,
    RouterLink,
    MatProgressBarModule,
    MatMenuModule,
    MatButtonModule,
    NgClass,
    FormsModule
  ],
  templateUrl: './allproject.component.html',
  styleUrl: './allproject.component.scss'
})


export class AllprojectComponent implements OnInit {

  apiData: Project[] = [];

  constructor(private projectService: ProjectService, private router: Router) { }

  ngOnInit(): void {
    this.getAllData();
  }

  getAllData() {
    this.projectService.getData().subscribe(res => {
      this.apiData = res;
    })
  }

  onView(id: number) {
    console.log("Viewing project with ID:", id);
    this.router.navigate(['projectdetails', id])
  }

  onUpdate(id: number) {
    this.router.navigate(['/addproject'], { queryParams: { editId: id } });
  }


  // delete
  onDelete(id: number) {
    // ✅ Confirmation dialog with SweetAlert2
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this project! This action cannot be undone.",
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
        this.projectService.deleteProject(id).subscribe({
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
              title: "Project deleted successfully!"
            });

            this.getAllData(); // Refresh list
          },
          error: (err) => {
            console.error('Error deleting project', err);

            // ❌ Error notification
            Swal.fire({
              title: "Error!",
              text: "Failed to delete project. Please try again.",
              icon: "error",
              confirmButtonText: "OK"
            });
          }
        });
      }
    });
  }


  //status
  getStatusClass(status: string): string {
    switch (status) {
      case 'Active': return 'bg-blue-800';
      case 'Completed': return 'bg-green-600';
      case 'Running': return 'bg-yellow-400 text-black';
      case 'Pending': return 'bg-gray-500';
      case 'Not Started': return 'bg-black';
      case 'Cancelled':
      case 'Cancled': return 'bg-red-600';
      default: return 'bg-gray-400';
    }
  }

  //priority
  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Low': return 'text-green-500';
      case 'Medium': return 'text-blue-500';
      case 'High': return 'text-red-500';
      default: return '';
    }
  }

  //priority icon 
  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'Low': return 'keyboard_arrow_down';
      case 'Medium': return 'code';
      case 'High': return 'keyboard_arrow_up';
      default: return '';
    }

  }

  //search
  // get filteredRecords(): Project[]{
  //   if(!this.searchText) return this.apiData;
  //   const search = this.searchText.toLowerCase();
  //   return this.apiData.filter(record =>{
  //     record.title.toLowerCase().includes(search)
  //   })
  // }

}
