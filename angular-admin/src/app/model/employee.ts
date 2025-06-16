export interface Employees {
  id: number;
  userId: number; 
  firstName: string;
  lastName: string;
  gender: string;
  mobile: number;
  department: string;
  designation: string;
  address: string;
  email: string;
  dob: Date | string;
  education: string;
  joindate: Date | string;
  skills: string;
  experience: string;
  location: string;
  about: string;
  file?: string;
  role: string;
}
