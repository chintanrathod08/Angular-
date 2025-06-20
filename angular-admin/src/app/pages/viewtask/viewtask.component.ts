import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, OnInit, Optional } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Tasks } from '../../model/tasks';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';


@Component({
  selector: 'app-viewtask',
  standalone: true,
  imports: [
    MatIconModule,
    NgIf,
    CommonModule
  ],
  templateUrl: './viewtask.component.html',
  styleUrl: './viewtask.component.scss'
})

export class ViewtaskComponent implements OnInit {

  taskData?: Tasks;

  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.taskService.getTaskById(id).subscribe({
      next: (res) => {
        this.taskData = res;
      }
    })
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Low': return 'text-green-500';
      case 'Normal': return 'text-blue-500';
      case 'High': return 'text-red-500';
      default: return '';
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'Low': return 'arrow_downward';
      case 'Normal': return 'remove';
      case 'High': return 'arrow_upward';
      default: return '';
    }
  }
}
