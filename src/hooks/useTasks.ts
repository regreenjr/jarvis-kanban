'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, Status } from '@/types/task';

const STORAGE_KEY = 'jarvis-kanban-tasks';

// Initial seed tasks
const SEED_TASKS: Task[] = [
  // DONE
  {
    id: 'task-001',
    title: '#4: Daily Email Triage',
    description: 'Morning digest of unread emails with AI-powered priority classification (URGENT/HIGH/MEDIUM/LOW) and action suggestions. Location: /Users/robbmacmini/clawd/tools/email-triage.js',
    status: 'done',
    priority: 'high',
    dueDate: null,
    createdAt: '2026-02-01T12:00:00.000Z',
  },
  {
    id: 'task-002',
    title: '#5: Inbox Zero Maintainer',
    description: 'Auto-filters and cleanup rules for newsletters, promotions, social notifications. Dry-run by default. Location: /Users/robbmacmini/clawd/tools/inbox-zero.js',
    status: 'done',
    priority: 'high',
    dueDate: null,
    createdAt: '2026-02-01T12:00:00.000Z',
  },
  {
    id: 'task-003',
    title: '#10: Daily Briefing Generator',
    description: 'Morning briefing combining overnight email summary, calendar events, priorities from memory, and decisions needed. Location: /Users/robbmacmini/clawd/tools/daily-briefing.js',
    status: 'done',
    priority: 'high',
    dueDate: null,
    createdAt: '2026-02-01T12:00:00.000Z',
  },
  {
    id: 'task-004',
    title: 'Kanban Board',
    description: 'Built and deployed Kanban board for Jarvis task management. GitHub: regreenjr/jarvis-kanban, Live: jarvis-kanban-orpin.vercel.app',
    status: 'done',
    priority: 'medium',
    dueDate: null,
    createdAt: '2026-02-01T15:30:00.000Z',
  },
  {
    id: 'task-005',
    title: 'Lucas Context: Production',
    description: 'Received and committed Project Enigma context from Lucas (content creation workflow, tools, bottlenecks). Saved to memory/project-enigma-context.md',
    status: 'done',
    priority: 'high',
    dueDate: null,
    createdAt: '2026-02-01T14:44:00.000Z',
  },
  {
    id: 'task-006',
    title: 'Model Upgrade to Opus 4.5',
    description: 'Upgraded primary model from Sonnet 4.5 to Opus 4.5. Updated both agents.defaults and flash agent config.',
    status: 'done',
    priority: 'medium',
    dueDate: null,
    createdAt: '2026-02-01T11:40:00.000Z',
  },
  // BACKLOG
  {
    id: 'task-007',
    title: '#7: Team Velocity Tracker',
    description: 'Track team productivity and output metrics. Needs Lucas context on team structure and current tracking methods.',
    status: 'backlog',
    priority: 'medium',
    dueDate: null,
    createdAt: '2026-01-31T18:24:00.000Z',
  },
  {
    id: 'task-008',
    title: '#8: Prompt Library Manager',
    description: 'Searchable collection of prompts used across the business. Organize, tag, and retrieve prompts easily.',
    status: 'backlog',
    priority: 'medium',
    dueDate: null,
    createdAt: '2026-01-31T18:24:00.000Z',
  },
  {
    id: 'task-009',
    title: '#9: AI Workflow Optimizer',
    description: 'Document current processes and identify automation opportunities. Find inefficiencies and suggest improvements.',
    status: 'backlog',
    priority: 'medium',
    dueDate: null,
    createdAt: '2026-01-31T18:24:00.000Z',
  },
  {
    id: 'task-010',
    title: 'Lucas Context: Distribution',
    description: 'Waiting for context from Lucas about TikTok posting, analyzing, and software used for distribution.',
    status: 'backlog',
    priority: 'high',
    dueDate: null,
    createdAt: '2026-02-01T15:18:00.000Z',
  },
  {
    id: 'task-011',
    title: 'Fix Unsubscribe Tool',
    description: 'The auto-unsubscribe feature in gmail-automation has a bug (cheerio.load expects string). Currently using auto-archive as workaround.',
    status: 'backlog',
    priority: 'low',
    dueDate: null,
    createdAt: '2026-02-01T14:41:00.000Z',
  },
  {
    id: 'task-012',
    title: 'TikTok Sandbox Research',
    description: 'Deep research into breaking out of TikTok sandbox. Current: ~200 views, Goal: 1000 avg views. Investigate SMS providers, warmup patterns, posting behavior.',
    status: 'backlog',
    priority: 'high',
    dueDate: null,
    createdAt: '2026-02-01T14:46:00.000Z',
  },
];

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Only use stored tasks if there are some, otherwise use seed
        if (parsed.length > 0) {
          setTasks(parsed);
        } else {
          setTasks(SEED_TASKS);
        }
      } catch (e) {
        console.error('Failed to parse stored tasks:', e);
        setTasks(SEED_TASKS);
      }
    } else {
      // No stored tasks, use seed data
      setTasks(SEED_TASKS);
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
