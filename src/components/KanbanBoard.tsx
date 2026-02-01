'use client';

import { useState } from 'react';
import { Task, Status } from '@/types/task';
import { useTasks } from '@/hooks/useTasks';
import KanbanColumn from './KanbanColumn';
import TaskModal from './TaskModal';

const columns: { status: Status; title: string }[] = [
  { status: 'backlog', title: 'Backlog' },
  { status: 'in-progress', title: 'In Progress' },
  { status: 'done', title: 'Done' },
];

export default function KanbanBoard() {
  const { tasks, isLoaded, addTask, updateTask, deleteTask, moveTask, getTasksByStatus } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<Status>('backlog');

  const handleAddTask = (status: Status) => {
    setEditingTask(null);
    setDefaultStatus(status);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDefaultStatus(task.status);
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Delete this task?')) {
      deleteTask(id);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {columns.map(column => (
          <KanbanColumn
            key={column.status}
            title={column.title}
            status={column.status}
            tasks={getTasksByStatus(column.status)}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onMoveTask={moveTask}
          />
        ))}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
        defaultStatus={defaultStatus}
      />
    </>
  );
}
