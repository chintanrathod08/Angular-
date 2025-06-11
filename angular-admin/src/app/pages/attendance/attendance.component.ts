import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AttendanceService } from '../../services/attendance.service';
import { Attendance } from '../../model/attendance';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';

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
    NgClass
  ]
})
export class AttendanceComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['employeeId', 'employeename', 'date', 'checkInTime', 'checkOutTime', 'totalWorkingHours', 'action'];
  searchText: string = '';

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

  attendanceRecords: Attendance[] = [];

  constructor(
    private attendanceService: AttendanceService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Assign employeeId and name from logged-in user
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
        this.showSnackBar('Checked in successfully!');
        this.startTimer(now);
        this.attendanceRecords.push({ ...attendanceData, id: response.id });
      },
      error: () => this.showSnackBar('Check-in failed!')
    });
  }

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
        }

        this.showSnackBar('Checked out successfully!');
      },
      error: () => this.showSnackBar('Check-out failed!')
    });
  }

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
    this.attendanceService.getAll().subscribe({
      next: (records) => (this.attendanceRecords = records || []),
      error: () => (this.attendanceRecords = [])
    });
  }

  get filteredRecords(): Attendance[] {
    if (!this.searchText) return this.attendanceRecords;
    const search = this.searchText.toLowerCase();
    return this.attendanceRecords.filter(record =>
      record.employeename.toLowerCase().includes(search) ||
      record.employeeId.toString().includes(search) ||
      record.date.includes(search)
    );
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this Attendance? 🗑️')) {
      this.attendanceService.deleteAttendance(id).subscribe({
        next: () => {
          this.attendanceRecords = this.attendanceRecords.filter(r => r.id !== id);
          this.showSnackBar('Attendance deleted successfully ✅');
        },
        error: (err) => {
          this.showSnackBar('Error deleting Attendance');
          console.error(err);
        }
      });
    }
  }
}