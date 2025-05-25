import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Estimate {
  id: number;
  project: string;
  client: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

@Component({
  selector: 'app-estimates',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <h1 class="text-2xl font-bold mb-4">Project Estimates</h1>
      <table class="min-w-full border text-left">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 border">#</th>
            <th class="px-4 py-2 border">Project</th>
            <th class="px-4 py-2 border">Client</th>
            <th class="px-4 py-2 border">Amount</th>
            <th class="px-4 py-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let estimate of estimates" class="hover:bg-gray-50">
            <td class="px-4 py-2 border">{{ estimate.id }}</td>
            <td class="px-4 py-2 border">{{ estimate.project }}</td>
            <td class="px-4 py-2 border">{{ estimate.client }}</td>
            <td class="px-4 py-2 border">₹{{ estimate.amount | number }}</td>
            <td class="px-4 py-2 border">
              <span
                class="inline-block px-2 py-1 rounded text-sm"
                [ngClass]="{
                  'bg-yellow-100 text-yellow-800': estimate.status === 'Pending',
                  'bg-green-100 text-green-800': estimate.status === 'Approved',
                  'bg-red-100 text-red-800': estimate.status === 'Rejected'
                }"
              >
                {{ estimate.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class EstimatesComponent implements OnInit {
  estimates: Estimate[] = [];

  ngOnInit() {
    // Replace this with real API logic if needed
    this.estimates = [
      { id: 1, project: 'Project Alpha', client: 'Client A', amount: 120000, status: 'Pending' },
      { id: 2, project: 'Project Beta', client: 'Client B', amount: 95000, status: 'Approved' },
      { id: 3, project: 'Project Gamma', client: 'Client C', amount: 110000, status: 'Rejected' },
    ];
  }
}
