'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@/types/task';

interface TaskStore {
  tasks: Task[];
  categories: string[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  clearCompletedTasks: () => void;
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
  tasks: [],
  // Use subject-based categories (school subjects / topics) for accuracy
  categories: ['Math', 'Physics', 'Chemistry', 'Biology', 'History', 'English'],
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, {
          ...task,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }],
      })),
      updateTask: (id, task) => set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id
            ? {
                ...t,
                ...task,
                updatedAt: new Date().toISOString(),
              }
            : t
        ),
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      })),
      toggleTaskComplete: (id) => set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id
            ? {
                ...t,
                completed: !t.completed,
                updatedAt: new Date().toISOString(),
              }
            : t
        ),
      })),
      clearCompletedTasks: () => set((state) => ({
        tasks: state.tasks.filter((t) => !t.completed),
      })),
      addCategory: (category) => set((state) => ({
        categories: [...state.categories, category],
      })),
      removeCategory: (category) => set((state) => ({
        categories: state.categories.filter((c) => c !== category),
      })),
    }),
    {
      name: 'task-storage',
    }
  )
);
