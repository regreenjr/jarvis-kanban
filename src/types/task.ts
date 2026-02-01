export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'backlog' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
  status: Status;
  createdAt: string;
}
