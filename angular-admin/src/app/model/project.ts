export interface Project {
  id: number;
  title: string;
  department: string;
  priority: 'Low' | 'Medium' | 'High';
  client: string;
  price: number;
  startDate: Date | string ; 
  endDate: Date | string;
  team: string;
  leader: string;
  status: 'Active' | 'Completed' | 'Running' | 'Pending' | 'Not Started' | 'Cancelled';
  description: string;
  progress: number;
}
