import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html'
})
export class ProjectDetailsComponent implements OnInit {
  project: Project | undefined;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.projectService.getProjectById(id).subscribe((data) => {
      this.project = data;
    });
  }
}
