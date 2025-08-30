'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, isSameDay } from 'date-fns';
import { Task } from '@/types/task';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface TaskTimelineProps {
  tasks: Task[];
  onTaskComplete: (taskId: string) => void;
}

export function TaskTimeline({ tasks, onTaskComplete }: TaskTimelineProps) {
  console.log('Tasks in TaskTimeline:', tasks);
  const todayRef = React.useRef(new Date());
  const today = todayRef.current;
  const daysToShow = 7;

  const tasksByDate = React.useMemo(() => {
    const taskMap = new Map<string, Task[]>();
    
    // Initialize the next 7 days
    for (let i = 0; i < daysToShow; i++) {
      const date = addDays(today, i);
      taskMap.set(format(date, 'yyyy-MM-dd'), []);
    }

    // Distribute tasks to dates
    tasks.forEach(task => {
      const dueDate = task.dueDate ? new Date(task.dueDate) : today;
      const dateKey = format(dueDate, 'yyyy-MM-dd');
      
      if (taskMap.has(dateKey)) {
        taskMap.get(dateKey)?.push(task);
      } else if (dueDate < today) {
        // If task is overdue, add to today
        taskMap.get(format(today, 'yyyy-MM-dd'))?.push({
          ...task,
          dueDate: today.toISOString(),
        });
      }
    });

    return taskMap;
  }, [tasks, today]);

  return (
    <div className="space-y-10 px-4 sm:px-8 lg:px-16">
      {Array.from({ length: daysToShow }).map((_, index) => {
        const date = addDays(today, index);
        const dateKey = format(date, 'yyyy-MM-dd');
        const dayTasks = tasksByDate.get(dateKey) || [];
        const isToday = isSameDay(date, today);

        return (
          <motion.div
            key={dateKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div className={cn(
              "sticky top-20 z-10 -ml-4 sm:-ml-6 mb-4 backdrop-blur-lg p-4 sm:p-6 rounded-r-2xl border-l-4 border bg-background/80",
              isToday ? "border-primary shadow-lg" : "border-border"
            )}>
              <h3 className={cn(
                "text-xl font-bold tracking-tight",
                isToday ? "text-primary" : "text-foreground"
              )}>
                {isToday ? "Today" : format(date, 'EEEE, MMMM d')}
              </h3>
            </div>

            <AnimatePresence mode="popLayout">
              {dayTasks.length > 0 ? (
                <motion.div 
                  layout
                  className="space-y-3 pl-4 sm:pl-8"
                >
                  {dayTasks.map(task => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={cn(
                        "group flex items-start gap-4 p-4 rounded-xl hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/30 shadow-sm"
                      )}
                    >
                      <Checkbox
                        id={task.id}
                        checked={task.completed}
                        onCheckedChange={() => onTaskComplete(task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <label
                          htmlFor={task.id}
                          className={cn(
                            "text-base font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                            task.completed && "line-through text-muted-foreground"
                          )}
                        >
                          {task.title}
                        </label>
                        {task.description && (
                          <p className={cn(
                            "text-sm text-muted-foreground mt-1",
                            task.completed && "line-through"
                          )}>
                            {task.description}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pl-4 sm:pl-8 py-6"
                >
                  <p className="text-base text-muted-foreground">No tasks for this day</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
