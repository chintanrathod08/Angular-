import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Tasks } from "../model/tasks";
import { AuthService } from './auth.service';
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  taskApi = 'http://localhost:3000/Tasks';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getTasks(): Observable<Tasks[]> {
    const user = this.authService.getUser();
    if (user?.role === 'admin') {
      return this.http.get<Tasks[]>(this.taskApi);
    } else if (user?.role === 'employee') {
      return this.http.get<Tasks[]>(`${this.taskApi}?assignedTo=${user.id}`);
    }
    return of([]);
  }

  // Keep other methods the same...
  postData(data: Tasks) {
    return this.http.post<Tasks>(this.taskApi, data);
  }

  getTaskById(id: number) {
    return this.http.get<Tasks>(`${this.taskApi}/${id}`);
  }

  updateTask(id: number, data: Tasks) {
    return this.http.put<Tasks>(`${this.taskApi}/${id}`, data);
  }

  deleteTask(id: number) {
    return this.http.delete(`${this.taskApi}/${id}`);
  }
}