import { Injectable } from '@angular/core';
import { Estimate } from '../models/estimate.model';

@Injectable({
  providedIn: 'root'
})
export class EstimateService {
  private estimates: Estimate[] = [
    {
      id: 1,
      projectName: 'Website Redesign',
      estimatedCost: 4200,
      createdOn: '2024-12-01',
      status: 'Draft'
    },
    {
      id: 2,
      projectName: 'Mobile App',
      estimatedCost: 7300,
      createdOn: '2025-01-10',
      status: 'Approved'
    }
  ];

  getAllEstimates(): Estimate[] {
    return this.estimates;
  }
}
