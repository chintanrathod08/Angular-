import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employees } from '../model/employee';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {

  epapi: string = "http://localhost:3000/employees";

  constructor(private http: HttpClient){}

  //postdata
  postData(data : Employees){
    return this.http.post<Employees[]>(this.epapi, data);
  }

  //get All Data
  getAllEmployee(){
    return this.http.get<Employees[]>(this.epapi)
  }

  // update employeeData
  updateEmployee(id: number, data: Employees){
    return this.http.put(`${this.epapi}/${id}`, data);
  }

  // employee profile 
  getDataByID(id: number){
    return this.http.get<Employees>(`${this.epapi}/${id}`)
  }

  // Delete Data
  deleteEmployee(id: number){
    return this.http.delete(`${this.epapi}/${id}`);
  }

}
