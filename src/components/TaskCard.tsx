'use client';

import { Task, Priority, Status } from '@/types/task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: Status) => void;
}

const priorityColors: Record<Priority, string> = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

const priorityLabels: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export default function TaskCard({ task, onEdit, onDelete, onMove }: TaskCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-gray-900 text-sm leading-tight flex-1">{task.title}</h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">{task.description}</p>
      )}
      
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
          {priorityLabels[task.priority]}
        </span>
        
        {task.dueDate && (
          <span className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
            {isOverdue && '⚠ '}
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>

      {/* Quick move buttons */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {task.status !== 'backlog' && (
          <button
            onClick={(e) => { e.stopPropagation(); onMove(task.id, 'backlog'); }}
            className="flex-1 text-xs py-1 px-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors"
          >
            → Backlog
          </button>
        )}
        {task.status !== 'in-progress' && (
          <button
            onClick={(e) => { e.stopPropagation(); onMove(task.id, 'in-progress'); }}
            className="flex-1 text-xs py-1 px-2 bg-blue-100 hover:bg-blue-200 rounded text-blue-600 transition-colors"
          >
            → In Progress
          </button>
        )}
        {task.status !== 'done' && (
          <button
            onClick={(e) => { e.stopPropagation(); onMove(task.id, 'done'); }}
            className="flex-1 text-xs py-1 px-2 bg-green-100 hover:bg-green-200 rounded text-green-600 transition-colors"
          >
            → Done
          </button>
        )}
      </div>
    </div>
  );
}
