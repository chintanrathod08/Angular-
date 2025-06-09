export interface Attendance {
  id?: number;
  employeeId: number;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  breakStartTime?: string;
  breakEndTime?: string;
  totalWorkingHours?: string;
}
