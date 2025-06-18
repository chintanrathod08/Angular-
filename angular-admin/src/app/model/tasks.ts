export interface Tasks {
    id: number;
    title: string;
    assignedTo: number;
    assignedName: string;
    priority: 'Low' | 'Normal' | 'High';
    duedate: Date | string;
    eventdetails: string;
    completed: boolean;
}