"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List } from "lucide-react";
import { useTaskStore } from "@/store/task-store";
import { TaskTimeline } from "@/components/tasks/task-timeline";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskForm } from "@/components/tasks/task-form";
import { Task } from "@/types/task";

// Set page title
if (typeof document !== 'undefined') {
  document.title = 'Tasks - Mind Axis';
}

export default function TaskPage() {
  // removed filter feature per request
  const [showCompleted, setShowCompleted] = React.useState(false);
  // Only timeline view

  const { tasks, toggleTaskComplete, categories } = useTaskStore();

  const filteredTasks = React.useMemo(() => {
    let filtered = tasks;

    if (!showCompleted) {
      filtered = filtered.filter((task: Task) => !task.completed);
    }

    return filtered;
  }, [tasks, showCompleted]);


  const completedCount = tasks.filter((task: Task) => task.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="flex-1 flex flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container max-w-6xl px-4 py-6 sm:py-8 md:py-12 mx-auto space-y-8 sm:space-y-12 md:space-y-16 flex-1 flex flex-col"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center space-y-3 sm:space-y-4"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 rounded-full liquid-card text-primary text-xs sm:text-sm font-medium mb-3"
          >
            <List className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Task Management</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 text-center text-black dark:text-white drop-shadow-lg"
            style={{fontFamily: 'var(--font-geist), Inter, sans-serif'}}
          >
            Tasks
          </motion.h1>
          <p className="text-muted-foreground mt-4 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-4">
            Your personal task manager. Stay organized, focused, and achieve your goals one task at a time.
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="relative flex-1"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/2 to-transparent rounded-xl blur-3xl -z-[1]" />
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start lg:items-center justify-between mb-8 sm:mb-12 liquid-card p-4 sm:p-6 rounded-xl"
          >
            <div className="w-full lg:w-auto">
              <p className="text-sm font-medium text-muted-foreground mb-3">Categories</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category: string) => (
                  <div key={category} className="text-xs px-2 sm:px-3 py-1 rounded-full liquid-card text-primary interactive-glow">
                    {category}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showCompleted"
                  checked={showCompleted}
                  onCheckedChange={(checked) => setShowCompleted(!!checked)}
                />
                <label
                  htmlFor="showCompleted"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Show completed tasks
                </label>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <TaskForm mode="create" onClose={() => {}} />
              </motion.div>
            </div>
          </motion.div>

          <div className="flex items-center justify-between mb-4 sm:mb-6 px-2 sm:px-4">
            <div className="flex items-center gap-4">
              <p className="text-xs sm:text-sm text-muted-foreground">
                {completedCount} of {totalCount} tasks completed
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {tasks.length > 0 ? (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <TaskTimeline tasks={filteredTasks} onTaskComplete={toggleTaskComplete} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 space-y-4"
              >
                <div className="w-24 h-24 mx-auto mb-6 opacity-50">
                  <motion.img
                    src="/window.svg"
                    alt="Start fresh"
                    className="w-full h-full"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                </div>
                <p className="text-muted-foreground text-lg">
                  Start fresh by adding your first task
                </p>
                <p className="text-muted-foreground/80 text-sm max-w-md mx-auto">
                  Breaking down your work into tasks makes it easier to manage and complete
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
