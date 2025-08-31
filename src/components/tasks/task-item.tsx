'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, Trash2 } from 'lucide-react';
import { Task } from '@/types/task';
import { useTaskStore } from '@/store/task-store';
import { TaskForm } from './task-form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type TaskItemProps = {
  task: Task;
};

export function TaskItem({ task }: TaskItemProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { toggleTaskComplete, deleteTask } = useTaskStore();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
      className={`group relative rounded-xl ${
        task.completed 
          ? 'liquid-card opacity-75' 
          : 'liquid-card interactive-glow'
      } p-6 transition-all`}
    >
      <div className="flex items-start gap-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => toggleTaskComplete(task.id)}
            className="mt-1"
          />
        </motion.div>

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col space-y-1">
              <h3 className={`font-medium text-lg ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </h3>
              <div className="flex items-center gap-2">
                <motion.span 
                  className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {task.category}
                </motion.span>
              </div>
            </div>
          </div>

          {task.description && (
            <p className={`text-sm text-muted-foreground ${task.completed ? 'line-through' : ''}`}>
              {task.description}
            </p>
          )}

          {task.dueDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Due {format(new Date(task.dueDate), 'PP')}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <TaskForm 
            task={{
              ...task,
              dueDate: task.dueDate,
              createdAt: task.createdAt,
              updatedAt: task.updatedAt,
            }} 
            mode="edit" 
            onClose={() => {
              // Edit form closed
            }} 
          />
          <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Task</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this task? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-4 pt-4">
                <Button variant="outline" onClick={() => setShowConfirmDelete(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteTask(task.id);
                    setShowConfirmDelete(false);
                  }}
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </motion.div>
  );
}
