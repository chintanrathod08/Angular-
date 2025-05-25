import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/project.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html'
})
export class AllProjectsComponent implements OnInit {
  projects: Project[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getAllProjects().subscribe((data) => {
      this.projects = data;
    });
  }
}



@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html'
})
export class AddProjectComponent {
  projectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      client: ['', Validators.required],
      budget: ['', [Validators.required, Validators.min(0)]],
      status: ['Pending', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.projectService.addProject(this.projectForm.value).subscribe(() => {
        this.router.navigate(['/dashboard/projects']);
      });
    }
  }
}
