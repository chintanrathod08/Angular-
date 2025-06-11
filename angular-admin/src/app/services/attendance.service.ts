import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attendance } from '../model/attendance';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private URL = 'http://localhost:3000/attendance';

  constructor(private http: HttpClient) {}

  add(data: Attendance): Observable<Attendance> {
    return this.http.post<Attendance>(this.URL, data);
  }

  getByEmployeeId(employeeId: number): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.URL}?employeeId=${employeeId}`);
  }

  update(id: number, data: Attendance): Observable<Attendance> {
    return this.http.put<Attendance>(`${this.URL}/${id}`, data);
  }

  getAll(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(this.URL);
  }

  getById(id: number): Observable<Attendance> {
    return this.http.get<Attendance>(`${this.URL}/${id}`);
  }

  // ✅ Corrected version
  getTodayByEmployee(employeeId: number): Observable<Attendance[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.http.get<Attendance[]>(`${this.URL}?employeeId=${employeeId}&date=${today}`);
  }

  // Delete
  deleteAttendance(id: number): Observable<any> {
    return this.http.delete(`${this.URL}/${id}`);
  }
}
