import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../services/attendance.service';
import { Attendance } from '../../model/attendance';

@Component({
  standalone: true,
  selector: 'app-attendance',
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceComponent implements OnInit {
  checkInTime = '';
  checkOutTime = '';
  totalWorkingHours = '';
  breakTime = '';
  employeeId = 101;
  isCheckedIn = false;

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.loadTodayRecord();
  }

  loadTodayRecord(): void {
    const today = new Date().toISOString().split('T')[0];
    this.attendanceService.getByEmployeeId(this.employeeId).subscribe((records) => {
      const todayRecord = records.find(r => r.date === today);
      if (todayRecord) {
        this.checkInTime = todayRecord.checkInTime || '';
        this.checkOutTime = todayRecord.checkOutTime || '';
        this.totalWorkingHours = todayRecord.totalWorkingHours || '';
        this.breakTime = '1h 00m';
        this.isCheckedIn = !!todayRecord.checkInTime && !todayRecord.checkOutTime;
      }
    });
  }

  onCheckIn(): void {
    const now = new Date();
    this.checkInTime = now.toLocaleTimeString();
    const today = now.toISOString().split('T')[0];

    const data: Attendance = {
      employeeId: this.employeeId,
      date: today,
      checkInTime: this.checkInTime
    };

    this.attendanceService.add(data).subscribe(() => {
      this.isCheckedIn = true;
      localStorage.setItem('checkInTime', this.checkInTime);
      this.loadTodayRecord(); // Refresh data
    });
  }

  onCheckOut(): void {
    const confirmCheckOut = confirm("Are you sure you want to check out?");
    if (!confirmCheckOut) return;

    const now = new Date();
    this.checkOutTime = now.toLocaleTimeString();
    const today = now.toISOString().split('T')[0];

    this.attendanceService.getByEmployeeId(this.employeeId).subscribe((records) => {
      const todayRecord = records.find(r => r.date === today);

      if (todayRecord && todayRecord.id && todayRecord.checkInTime) {
        const workingHours = this.calculateWorkingHours(todayRecord.checkInTime, this.checkOutTime);

        const updatedRecord: Attendance = {
          ...todayRecord,
          checkOutTime: this.checkOutTime,
          totalWorkingHours: workingHours
        };

        this.attendanceService.update(todayRecord.id, updatedRecord).subscribe(() => {
          this.isCheckedIn = false;
          this.totalWorkingHours = workingHours;
          this.breakTime = '1h 00m';
          localStorage.removeItem('checkInTime');
          alert('Checkout successful!');
          this.loadTodayRecord(); // Refresh data
        });
      } else {
        alert("Check-in record not found for today.");
      }
    });
  }

  calculateWorkingHours(inTime: string, outTime: string): string {
    const inDate = new Date(`1970-01-01T${inTime}`);
    const outDate = new Date(`1970-01-01T${outTime}`);
    const diffInMinutes = (outDate.getTime() - inDate.getTime()) / 60000;
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = Math.floor(diffInMinutes % 60);
    return `${hours}h ${minutes}m`;
  }
}
