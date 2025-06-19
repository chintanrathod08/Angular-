export interface Tasks {
    id: number;
    title: string;
    assignedTo: number;
    assignedName: string;
    clientname: string;
    priority: 'Low' | 'Normal' | 'High';
    taskdate : Date | string;
    duedate: Date | string;
    eventdetails: string;
    completed: boolean;
}