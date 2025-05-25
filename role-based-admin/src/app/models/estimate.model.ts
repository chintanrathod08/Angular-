export interface Estimate {
  id: number;
  projectName: string;
  estimatedCost: number;
  createdOn: string;
  status: 'Draft' | 'Submitted' | 'Approved';
}
