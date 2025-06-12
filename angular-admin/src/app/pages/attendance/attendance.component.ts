import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AttendanceService } from '../../services/attendance.service';
import { Attendance } from '../../model/attendance';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgIf } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    MatTableModule,
    RouterLink,
    MatButtonModule,
    NgClass,
    NgIf
  ]
})
export class AttendanceComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['employeeId', 'employeename', 'date', 'checkInTime', 'checkOutTime', 'totalWorkingHours', 'action'];

  searchText: string = '';
  attendanceRecords: Attendance[] = [];

  employeeId!: number;
  employeename!: string;
  checkInTime: string = '';
  checkOutTime: string = '';
  totalWorkingHours: string = '';
  breakTime: string = '01:00';

  isCheckedIn: boolean = false;
  timerDisplay: string = '00:00:00';
  private timerInterval: any;
  currentAttendanceId?: number;

  constructor(
    private attendanceService: AttendanceService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.id || !user?.name) {
      this.showSnackBar('Login required');
      return;
    }

    this.employeeId = user.id;
    this.employeename = user.name;

    this.checkTodayAttendance();
    this.fetchAllRecords();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  toggleAttendance(): void {
    this.isCheckedIn ? this.onCheckOut() : this.onCheckIn();
  }

  //---- checkin -----:
  private onCheckIn(): void {
    const now = new Date();
    const checkInFormatted = this.formatTime(now);
    this.checkInTime = checkInFormatted;

    const attendanceData: Attendance = {
      employeeId: this.employeeId,
      employeename: this.employeename,
      date: this.date,
      checkInTime: checkInFormatted,
      checkOutTime: '',
      totalWorkingHours: ''
    };

    this.attendanceService.add(attendanceData).subscribe({
      next: (response) => {
        this.isCheckedIn = true;
        this.currentAttendanceId = response.id;
        // this.showSnackBar('Checked in successfully!');
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
          title: "Checked in successfully!"
        });
        this.startTimer(now);
        this.attendanceRecords = [...this.attendanceRecords, { ...attendanceData, id: response.id }];
      },
      error: () => {
        // this.showSnackBar('Check-in failed!')
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
          title: "Check-in failed!"
        });
      }
    });
  }

  //---- checkout -------:
  private onCheckOut(): void {
    if (!this.currentAttendanceId) return;

    const now = new Date();
    const checkOutFormatted = this.formatTime(now);
    this.checkOutTime = checkOutFormatted;

    const checkInDate = new Date(`${this.date} ${this.convertTo24Hour(this.checkInTime)}`);
    const checkOutDate = new Date(`${this.date} ${this.convertTo24Hour(checkOutFormatted)}`);
    let diffMs = checkOutDate.getTime() - checkInDate.getTime();
    diffMs -= 1 * 60 * 60 * 1000; // Subtract 1hr break

    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const totalWorkingHours = `${totalHours.toString().padStart(2, '0')}:${totalMinutes.toString().padStart(2, '0')}`;

    const updateData: Attendance = {
      employeeId: this.employeeId,
      employeename: this.employeename,
      date: this.date,
      checkInTime: this.checkInTime,
      checkOutTime: this.checkOutTime,
      totalWorkingHours
    };

    this.attendanceService.update(this.currentAttendanceId, updateData).subscribe({
      next: () => {
        this.totalWorkingHours = totalWorkingHours;
        this.isCheckedIn = false;
        this.stopTimer();

        const index = this.attendanceRecords.findIndex(r => r.id === this.currentAttendanceId);
        if (index !== -1) {
          this.attendanceRecords[index] = { ...updateData, id: this.currentAttendanceId };
          // ✅ This will force Angular to re-render the updated table row
          this.attendanceRecords = [...this.attendanceRecords];
        }

        Swal.fire({
          toast: true,
          position: "top",
          icon: "success",
          title: "Checked out successfully!",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: toast => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
      },
      error: () => {
        Swal.fire({
          toast: true,
          position: "top",
          icon: "error",
          title: "Check-out failed!",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: toast => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
      }
    });
  }

  // ---------
  private startTimer(startTime: Date): void {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      const now = new Date().getTime();
      const elapsed = now - startTime.getTime();

      const hrs = Math.floor(elapsed / (1000 * 60 * 60));
      const mins = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((elapsed % (1000 * 60)) / 1000);

      this.timerDisplay = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerDisplay = '00:00:00';
  }

  private formatTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${adjustedHours}:${formattedMinutes} ${ampm}`;
  }

  private convertTo24Hour(time12h: string): string {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  get date(): string {
    return new Date().toISOString().split('T')[0];
  }

  checkTodayAttendance(): void {
    this.attendanceService.getTodayByEmployee(this.employeeId).subscribe({
      next: (records) => {
        const record = records[0];
        if (record && record.checkInTime && !record.checkOutTime) {
          this.isCheckedIn = true;
          this.checkInTime = record.checkInTime;
          this.currentAttendanceId = record.id;
          const checkInDate = new Date(`${record.date} ${this.convertTo24Hour(record.checkInTime)}`);
          this.startTimer(checkInDate);
        }
      },
      error: () => (this.isCheckedIn = false)
    });
  }

  fetchAllRecords(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user?.role;

    this.attendanceService.getAll().subscribe({
      next: (records) => {
        if (role === 'employee') {
          // Only show logged-in employee's records
          this.attendanceRecords = records.filter(record => record.employeeId === this.employeeId);
        } else {
          // Admin can see all
          this.attendanceRecords = records || [];
        }
      },
      error: () => (this.attendanceRecords = [])
    });
  }


  // Search
  get filteredRecords(): Attendance[] {
    if (!this.searchText) return this.attendanceRecords;
    const search = this.searchText.toLowerCase();
    return this.attendanceRecords.filter(record =>
      record.employeename.toLowerCase().includes(search) ||
      record.employeeId.toString().includes(search) ||
      record.date.includes(search)
    );
  }

  // Delete
  onDelete(id: number): void {
    // ✅ SweetAlert2 confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this attendance record! This action cannot be undone.",
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
          text: 'Please wait while we delete the attendance record.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // ✅ Actual delete operation
        this.attendanceService.deleteAttendance(id).subscribe({
          next: () => {
            // Update local array
            this.attendanceRecords = this.attendanceRecords.filter(r => r.id !== id);

            // ✅ Success notification with SweetAlert2
            Swal.fire({
              title: "Deleted!",
              text: "Attendance record has been deleted successfully.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err) => {
            console.error('Error deleting attendance', err);

            // ✅ Error notification with SweetAlert2
            Swal.fire({
              title: "Error!",
              text: "Failed to delete attendance record. Please try again.",
              icon: "error",
              confirmButtonText: "OK"
            });
          }
        });
      }
      // ✅ If cancelled, do nothing
    });
  }
}
