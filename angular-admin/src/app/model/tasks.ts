export interface Tasks{
    id: number;
    title: string;
    assignedname: string;
    priority: 'Low' | 'Normal' | 'High';
    duedate: Date | string;
    eventdetails: string;
     completed: boolean;
}