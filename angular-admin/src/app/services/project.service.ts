import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '../project';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  api: string = "http://localhost:3000/projects";

  constructor(private http: HttpClient) { }

  // postData
  postData(data: Project) {
    return this.http.post<Project[]>(this.api, data);
  }

  //get All Data
  getData() {
    return this.http.get<Project[]>(this.api)
  }

  // update
  updateProject(id: number, data: Project) {
    return this.http.put(`${this.api}/${id}`, data);
  }


  // ProjectDetails
  getDataByID(id: number) {
    return this.http.get<Project>(`${this.api}/${id}`)
  }

  // Delete Data
  deleteProject(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }

}

