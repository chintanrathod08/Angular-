import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Employee } from '../../model/employee';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employeeprofile',
  imports: [CommonModule,MatIconModule,RouterModule,MatIconModule],
  templateUrl: './employeeprofile.component.html',
  styleUrl: './employeeprofile.component.scss'
})
export class EmployeeprofileComponent {

  employeeData?: Employee;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router
  ){}

  ngOnInit(): void{
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.employeeService.getDataByID(id).subscribe({
      next: (res)=>{
        this.employeeData = res;
      }
    })
  }

}
