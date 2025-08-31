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
    <div className="min-h-screen flex flex-col items-center justify-start">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12 space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12 flex-1 flex flex-col"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 px-2 sm:px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 rounded-full liquid-card text-primary text-xs sm:text-sm md:text-base font-medium mb-3 sm:mb-4"
          >
            <List className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            <span>Task Management</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-2 text-center text-black dark:text-white drop-shadow-lg leading-tight"
            style={{fontFamily: 'var(--font-geist), Inter, sans-serif'}}
          >
            Tasks
          </motion.h1>
          <p className="text-muted-foreground mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl xl:max-w-4xl mx-auto px-2 sm:px-4 leading-relaxed">
            Your personal task manager. Stay organized, focused, and achieve your goals one task at a time.
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="relative flex-1 w-full"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/2 to-transparent rounded-xl blur-3xl -z-[1]" />
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col xl:flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-8 items-start xl:items-center justify-between mb-6 sm:mb-8 md:mb-10 lg:mb-12 liquid-card p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl"
          >
            <div className="w-full xl:w-auto">
              <p className="text-xs sm:text-sm md:text-base font-medium text-muted-foreground mb-2 sm:mb-3">Categories</p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3">
                {categories.map((category: string) => (
                  <div key={category} className="text-xs sm:text-sm px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full liquid-card text-primary interactive-glow">
                    {category}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-5 w-full xl:w-auto">
              <div className="flex items-center justify-between w-full sm:w-auto gap-3 sm:gap-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Checkbox
                    id="showCompleted"
                    checked={showCompleted}
                    onCheckedChange={(checked) => setShowCompleted(!!checked)}
                  />
                  <label
                    htmlFor="showCompleted"
                    className="text-xs sm:text-sm md:text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Show completed tasks
                  </label>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <TaskForm mode="create" onClose={() => {
                    // Task form closed
                  }} />
                </motion.div>
              </div>
            </div>
          </motion.div>

          <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-5 lg:mb-6 px-1 sm:px-2 md:px-3 lg:px-4">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
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
                className="text-center py-8 sm:py-12 md:py-16 lg:py-20 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 px-2 sm:px-4"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mx-auto mb-4 sm:mb-5 md:mb-6 opacity-50">
                  <motion.img
                    src="/window.svg"
                    alt="Start fresh"
                    className="w-full h-full"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                </div>
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl">
                  Start fresh by adding your first task
                </p>
                <p className="text-muted-foreground/80 text-xs sm:text-sm md:text-base max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto leading-relaxed">
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
