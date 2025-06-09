import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../services/attendance.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-attendance-list',
  imports: [CommonModule, MatTableModule, MatIconModule, RouterLink],
  templateUrl: './attendance-list.component.html',
  styleUrl: './attendance-list.component.scss'
})
export class AttendanceListComponent implements OnInit {
  attendanceRecords: any[] = [];
  displayedColumns: string[] = ['employeeId', 'date', 'checkInTime', 'checkOutTime', 'totalWorkingHours'];

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.fetchAttendance();
  }

  fetchAttendance(): void {
    this.attendanceService.getAll().subscribe((res) => {
      this.attendanceRecords = res;
    });
  }
}
