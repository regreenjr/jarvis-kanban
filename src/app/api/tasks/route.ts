import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Task } from '@/types/task';

const DATA_FILE = path.join(process.cwd(), 'data', 'tasks.json');

// Seed tasks for initial setup
const SEED_TASKS: Task[] = [
  {
    id: 'task-001',
    title: '#4: Daily Email Triage',
    description: 'Morning digest of unread emails with AI-powered priority classification. Location: /Users/robbmacmini/clawd/tools/email-triage.js',
    status: 'done',
    priority: 'high',
    dueDate: null,
    createdAt: '2026-02-01T12:00:00.000Z',
  },
  {
    id: 'task-002',
    title: '#5: Inbox Zero Maintainer',
    description: 'Auto-filters and cleanup rules for newsletters, promotions. Location: /Users/robbmacmini/clawd/tools/inbox-zero.js',
    status: 'done',
    priority: 'high',
    dueDate: null,
    createdAt: '2026-02-01T12:00:00.000Z',
  },
  {
    id: 'task-003',
    title: '#10: Daily Briefing Generator',
    description: 'Morning briefing combining email summary, calendar, priorities. Location: /Users/robbmacmini/clawd/tools/daily-briefing.js',
    status: 'done',
    priority: 'high',
    dueDate: null,
    createdAt: '2026-02-01T12:00:00.000Z',
  },
  {
    id: 'task-004',
    title: 'Kanban Board',
    description: 'Built and deployed Kanban board. GitHub: regreenjr/jarvis-kanban',
    status: 'done',
    priority: 'medium',
    dueDate: null,
    createdAt: '2026-02-01T15:30:00.000Z',
  },
  {
    id: 'task-005',
    title: 'VERCEL_TOKEN Setup',
    description: 'Set up VERCEL_TOKEN for direct Kanban deploys',
    status: 'done',
    priority: 'medium',
    dueDate: null,
    createdAt: '2026-02-01T16:00:00.000Z',
  },
  {
    id: 'task-006',
    title: 'QMD Installation',
    description: 'Install QMD for better memory search',
    status: 'done',
    priority: 'medium',
    dueDate: null,
    createdAt: '2026-02-01T17:00:00.000Z',
  },
  {
    id: 'task-007',
    title: 'Email Automation Crons',
    description: 'Set up triage/briefing/cleanup cron cycle',
    status: 'done',
    priority: 'high',
    dueDate: null,
    createdAt: '2026-02-01T18:00:00.000Z',
  },
  {
    id: 'task-008',
    title: 'Maintenance Engagement Scheduler',
    description: 'Test with Lucas - prevents behavioral cliff detection on TikTok accounts',
    status: 'in-progress',
    priority: 'high',
    dueDate: null,
    createdAt: '2026-02-02T08:00:00.000Z',
  },
  {
    id: 'task-009',
    title: 'TikTok Posting Time Shift',
    description: 'Shift posting window to 7-9 PM EST (peak usage hours)',
    status: 'in-progress',
    priority: 'high',
    dueDate: null,
    createdAt: '2026-02-02T08:00:00.000Z',
  },
  {
    id: 'task-010',
    title: 'Calendar OAuth Scope',
    description: 'Fix daily briefing to use correct OAuth token with calendar scope',
    status: 'done',
    priority: 'medium',
    dueDate: null,
    createdAt: '2026-02-02T16:55:00.000Z',
  },
  {
    id: 'task-011',
    title: '#7: Team Velocity Tracker',
    description: 'Track team productivity metrics. Needs Lucas context.',
    status: 'backlog',
    priority: 'medium',
    dueDate: null,
    createdAt: '2026-01-31T18:24:00.000Z',
  },
  {
    id: 'task-012',
    title: '#8: Prompt Library Manager',
    description: 'Searchable collection of prompts used across the business.',
    status: 'backlog',
    priority: 'medium',
    dueDate: null,
    createdAt: '2026-01-31T18:24:00.000Z',
  },
  {
    id: 'task-013',
    title: 'Lucas Context: Distribution',
    description: 'Waiting for context about TikTok posting, analyzing, software.',
    status: 'backlog',
    priority: 'high',
    dueDate: null,
    createdAt: '2026-02-01T15:18:00.000Z',
  },
];

async function ensureDataFile(): Promise<Task[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    // File doesn't exist, create with seed data
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(SEED_TASKS, null, 2));
    return SEED_TASKS;
  }
}

async function saveTasks(tasks: Task[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// GET - Fetch all tasks
export async function GET() {
  try {
    const tasks = await ensureDataFile();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error reading tasks:', error);
    return NextResponse.json({ error: 'Failed to read tasks' }, { status: 500 });
  }
}

// POST - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tasks = await ensureDataFile();
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: body.title,
      description: body.description || '',
      status: body.status || 'backlog',
      priority: body.priority || 'medium',
      dueDate: body.dueDate || null,
      createdAt: new Date().toISOString(),
    };
    
    tasks.push(newTask);
    await saveTasks(tasks);
    
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

// PUT - Update a task
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    }
    
    const tasks = await ensureDataFile();
    const index = tasks.findIndex(t => t.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    tasks[index] = { ...tasks[index], ...updates };
    await saveTasks(tasks);
    
    return NextResponse.json(tasks[index]);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE - Delete a task
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    }
    
    const tasks = await ensureDataFile();
    const filtered = tasks.filter(t => t.id !== id);
    
    if (filtered.length === tasks.length) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    await saveTasks(filtered);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
