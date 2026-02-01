'use client';

import { Task, Status } from '@/types/task';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  title: string;
  status: Status;
  tasks: Task[];
  onAddTask: (status: Status) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onMoveTask: (id: string, status: Status) => void;
}

const columnColors: Record<Status, string> = {
  'backlog': 'border-t-gray-400',
  'in-progress': 'border-t-blue-500',
  'done': 'border-t-green-500',
};

const countColors: Record<Status, string> = {
  'backlog': 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  'done': 'bg-green-100 text-green-700',
};

export default function KanbanColumn({ 
  title, 
  status, 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask,
  onMoveTask 
}: KanbanColumnProps) {
  return (
    <div className={`bg-gray-50 rounded-lg border-t-4 ${columnColors[status]} flex flex-col min-h-[500px] md:min-h-[600px]`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-gray-800">{title}</h2>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${countColors[status]}`}>
              {tasks.length}
            </span>
          </div>
          <button
            onClick={() => onAddTask(status)}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
            title="Add task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-3 space-y-3 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No tasks yet
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onMove={onMoveTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
