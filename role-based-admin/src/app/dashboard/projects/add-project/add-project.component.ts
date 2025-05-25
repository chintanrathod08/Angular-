import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../../services/project.service';
import { Router } from '@angular/router';

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
      this.projectService.addProject(this.projectForm.value);
      this.router.navigate(['/dashboard/projects']);
    }
  }
}
