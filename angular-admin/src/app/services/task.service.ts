import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Tasks } from "../model/tasks";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  taskApi = 'http://localhost:3000/Tasks'; 

  constructor(private http: HttpClient) {}

  postData(data: Tasks) {
    return this.http.post<Tasks>(this.taskApi, data);
  }

  getData() {
    return this.http.get<Tasks[]>(this.taskApi);
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
