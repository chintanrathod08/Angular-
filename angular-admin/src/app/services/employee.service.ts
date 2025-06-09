import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../model/employee';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {

  epapi: string = "http://localhost:3000/employee";

  constructor(private http: HttpClient){}

  //postdata
  postData(data : Employee){
    return this.http.post<Employee[]>(this.epapi, data);
  }

  //get All Data
  getData(){
    return this.http.get<Employee[]>(this.epapi)
  }

  // update employeeData
  updateEmployee(id: number, data: Employee){
    return this.http.put(`${this.epapi}/${id}`, data);
  }

  // employee profile 
  getDataByID(id: number){
    return this.http.get<Employee>(`${this.epapi}/${id}`)
  }

  // Delete Data
  deleteEmployee(id: number){
    return this.http.delete(`${this.epapi}/${id}`);
  }

}
