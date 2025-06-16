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

    // ✅ Always create a new entry for each check-in
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

        Swal.fire({
          toast: true,
          position: "top",
          icon: "success",
          title: "Checked in successfully!",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });

        this.startTimer(now);
        this.attendanceRecords = [...this.attendanceRecords, { ...attendanceData, id: response.id }];
      },
      error: () => {
        Swal.fire({
          toast: true,
          position: "top",
          icon: "error",
          title: "Check-in failed!",
          showConfirmButton: false,
          timer: 3000
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
    const breakMs = 1 * 60 * 60 * 1000;

    if (diffMs > breakMs) {
      diffMs -= breakMs;
    }

    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const totalWorkingHours = `${totalHours.toString().padStart(2, '0')}:${totalMinutes.toString().padStart(2, '0')}`;

    const hoursText = totalHours > 0 ? `${totalHours} hour${totalHours > 1 ? 's' : ''}` : '';
    const minutesText = totalMinutes > 0 ? `${totalMinutes} minute${totalMinutes > 1 ? 's' : ''}` : '';
    const totalWorkingText = [hoursText, minutesText].filter(Boolean).join(' ') || '0 minutes';

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

        // ✅ Update existing record in the array
        // Update local record before clearing ID
        const index = this.attendanceRecords.findIndex(r => r.id === this.currentAttendanceId);
        if (index !== -1) {
          this.attendanceRecords[index] = { ...updateData, id: this.currentAttendanceId };
          this.attendanceRecords = [...this.attendanceRecords]; // Force re-render
        }

        this.totalWorkingHours = totalWorkingHours;
        this.isCheckedIn = false;
        this.stopTimer();
        this.currentAttendanceId = undefined;


        // ✅ Then clear the ID
        this.currentAttendanceId = undefined;

        Swal.fire({
          toast: true,
          position: "top",
          icon: "success",
          title: `Checked out successfully!`,
          text: `Session: ${totalWorkingText} | Today Total: ${this.calculateTodayTotalHours()}`,
          showConfirmButton: false,
          timer: 5000,
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


  // ✅ Calculate total working hours for today from all sessions
  private calculateTodayTotalHours(): string {
    const todayRecords = this.attendanceRecords.filter(record =>
      record.date === this.date &&
      record.employeeId === this.employeeId &&
      record.checkOutTime &&
      record.totalWorkingHours
    );

    let totalMinutes = 0;

    todayRecords.forEach(record => {
      if (record.totalWorkingHours) {
        const [hours, minutes] = record.totalWorkingHours.split(':').map(Number);
        totalMinutes += (hours * 60) + minutes;
      }
    });

    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    const hoursText = totalHours > 0 ? `${totalHours} hour${totalHours > 1 ? 's' : ''}` : '';
    const minutesText = remainingMinutes > 0 ? `${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}` : '';
    return [hoursText, minutesText].filter(Boolean).join(' ') || '0 minutes';
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
        const activeRecord = records.find(record => record.checkInTime && !record.checkOutTime);
        console.log('Active Record:', activeRecord);

        if (activeRecord && activeRecord.checkInTime) {
          try {
            this.isCheckedIn = true;
            this.checkInTime = activeRecord.checkInTime;
            this.currentAttendanceId = activeRecord.id;

            const checkIn24 = this.convertTo24Hour(activeRecord.checkInTime);
            const checkInDate = new Date(`${activeRecord.date} ${checkIn24}`);
            this.startTimer(checkInDate);
          } catch (e) {
            console.error('checkTodayAttendance Error:', e);
          }
        }
      },
      error: (err) => {
        console.error('Error fetching today\'s attendance:', err);
        this.isCheckedIn = false;
      }
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

  // ✅ Get today's total sessions count
  get todaySessionsCount(): number {
    return this.attendanceRecords.filter(record =>
      record.date === this.date &&
      record.employeeId === this.employeeId
    ).length;
  }

  // ✅ Get today's total working hours
  get todayTotalWorkingHours(): string {
    return this.calculateTodayTotalHours();
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
              title: "Delete attendance record successfully!"
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