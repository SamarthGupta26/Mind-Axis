'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useTaskStore } from '@/store/task-store';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

type TaskFormProps = {
  task?: Task;
  mode: 'create' | 'edit';
  onClose: () => void;
};

export function TaskForm({ task, mode, onClose }: TaskFormProps) {
  const [open, setOpen] = useState(false);
  const { categories, addTask, updateTask } = useTaskStore();
  
  const [formData, setFormData] = useState<Pick<Task, 'title' | 'description' | 'category' | 'dueDate'>>({
    title: task?.title || '',
    description: task?.description || '',
    category: task?.category || categories[0],
    dueDate: task?.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'create') {
      addTask({
        ...formData,
        completed: false,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
      });
    } else if (task) {
      updateTask(task.id, {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
      });
    }
    
    setOpen(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={mode === 'create' ? 'default' : 'ghost'} 
          size={mode === 'create' ? 'default' : 'default'}
          className={`${mode === 'create' 
            ? 'rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 h-8 sm:h-9 md:h-auto' 
            : 'text-sm sm:text-base'
          }`}
        >
          {mode === 'create' ? (
            <>
              <span className="hidden sm:inline">Add New Task</span>
              <span className="sm:hidden">Add Task</span>
            </>
          ) : 'Edit'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[800px] p-3 sm:p-4 md:p-5 lg:p-6 overflow-hidden bg-background/95 max-h-[90vh] overflow-y-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background pointer-events-none" />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-xl pointer-events-none" />
        <div className="relative z-10">
          <DialogHeader className="space-y-2 pb-3 sm:pb-4">
            <DialogTitle className="text-base sm:text-lg md:text-xl lg:text-2xl bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              {mode === 'create' ? 'Create Task' : 'Edit Task'}
            </DialogTitle>
            <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
              {mode === 'create' 
                ? 'Break down your work into manageable tasks.'
                : 'Update your task details to stay on track.'}
            </p>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm sm:text-base">Task Title</Label>
              <Input
                id="title"
                placeholder="E.g., Complete Math Exercise 7.5"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="h-10 sm:h-11 md:h-12 bg-background/50 backdrop-blur-sm text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm sm:text-base">Description</Label>
              <Textarea
                id="description"
                placeholder="Add any important details..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="bg-background/50 backdrop-blur-sm resize-none text-sm sm:text-base"
              />
            </div>

            {/* Removed priority field */}

            <div className="space-y-2 col-span-1 md:col-span-2">
              <Label className="text-sm sm:text-base">Subject</Label>
              <RadioGroup
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                className="flex flex-wrap gap-2 sm:gap-3 md:gap-4"
              >
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-1.5 sm:space-x-2">
                    <RadioGroupItem value={category} id={category} />
                    <Label 
                      htmlFor={category} 
                      className="text-xs sm:text-sm px-2 py-0.5 rounded bg-primary/5"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2 col-span-1">
              <Label htmlFor="dueDate" className="text-sm sm:text-base">Due Date (Optional)</Label>
              <div className="relative">
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate || ''}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value || undefined })}
                  className="pl-8 sm:pl-10 h-10 sm:h-11 md:h-12 bg-background/50 backdrop-blur-sm text-sm sm:text-base"
                />
                <Calendar className="absolute left-2 sm:left-3 top-2.5 sm:top-3 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </div>
            </div>

            <motion.div 
              className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 col-span-1 md:col-span-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="w-full sm:w-auto px-4 order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="w-full sm:w-auto px-4 bg-primary/90 hover:bg-primary order-1 sm:order-2"
              >
                {mode === 'create' ? 'Create Task' : 'Save Changes'}
              </Button>
            </motion.div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
