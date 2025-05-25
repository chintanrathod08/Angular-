export interface Project {
  id: number;
  name: string;
  client: string;
  budget: number;
  status: 'Pending' | 'Ongoing' | 'Completed';
}
