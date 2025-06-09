import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attendance } from '../model/attendance';

@Injectable({ providedIn: 'root' })
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
}
