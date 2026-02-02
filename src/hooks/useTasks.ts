'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, Status } from '@/types/task';

const API_URL = '/api/tasks';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load tasks from API on mount
  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();
        setTasks(data);
        setError(null);
      } catch (e) {
        console.error('Failed to load tasks:', e);
        setError('Failed to load tasks');
      } finally {
        setIsLoaded(true);
      }
    }
    fetchTasks();
  }, []);

  const addTask = useCallback(async (task: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (!response.ok) throw new Error('Failed to create task');
      const newTask = await response.json();
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (e) {
      console.error('Failed to add task:', e);
      throw e;
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      if (!response.ok) throw new Error('Failed to update task');
      const updatedTask = await response.json();
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ));
    } catch (e) {
      console.error('Failed to update task:', e);
      throw e;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete task');
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (e) {
      console.error('Failed to delete task:', e);
      throw e;
    }
  }, []);

  const moveTask = useCallback(async (id: string, newStatus: Status) => {
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to move task');
      setTasks(prev => prev.map(task =>
        task.id === id ? { ...task, status: newStatus } : task
      ));
    } catch (e) {
      console.error('Failed to move task:', e);
      throw e;
    }
  }, []);

  const getTasksByStatus = useCallback((status: Status) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  return {
    tasks,
    isLoaded,
    error,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByStatus,
  };
}
