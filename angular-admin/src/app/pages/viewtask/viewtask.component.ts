import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Tasks } from '../../model/tasks';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';


@Component({
  selector: 'app-viewtask',
  standalone: true,
  imports: [
    MatIconModule,
    NgIf,
    // RouterLink
  ],
  templateUrl: './viewtask.component.html',
  styleUrl: './viewtask.component.scss'
})

export class ViewtaskComponent implements OnInit {

  taskData?: Tasks;

  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router ){}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.taskService.getTaskById(id).subscribe({
      next: (res)=>{
        this.taskData = res;
      }
    })
  }

}
