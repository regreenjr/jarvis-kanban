'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, Status } from '@/types/task';

const STORAGE_KEY = 'jarvis-kanban-tasks';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored tasks:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const moveTask = useCallback((id: string, newStatus: Status) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, status: newStatus } : task
    ));
  }, []);

  const getTasksByStatus = useCallback((status: Status) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  return {
    tasks,
    isLoaded,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByStatus,
  };
}
