import { Component, OnInit } from '@angular/core';
import { EstimateService } from '../../../services/estimate.service';
import { Estimate } from '../../../models/estimate.model';

@Component({
  selector: 'app-estimates',
  templateUrl: './estimates.component.html'
})
export class EstimatesComponent implements OnInit {
  estimates: Estimate[] = [];

  constructor(private estimateService: EstimateService) {}

  ngOnInit(): void {
    this.estimates = this.estimateService.getAllEstimates();
  }
}
