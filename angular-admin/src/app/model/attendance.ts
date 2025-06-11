export interface Attendance {
  id?: number;
  employeeId: number;
  employeename: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  totalWorkingHours?: string;
  breakStartTime?: string;
  breakEndTime?: string;
}
