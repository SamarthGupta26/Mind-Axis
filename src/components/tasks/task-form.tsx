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
          size={mode === 'create' ? 'lg' : 'default'}
          className={mode === 'create' ? 'rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200' : ''}
        >
          {mode === 'create' ? 'Add New Task' : 'Edit'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[800px] p-4 sm:p-6 overflow-hidden bg-background/95">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background pointer-events-none" />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-xl pointer-events-none" />
        <div className="relative z-10">
          <DialogHeader className="space-y-2 pb-4">
            <DialogTitle className="text-lg sm:text-xl bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              {mode === 'create' ? 'Create Task' : 'Edit Task'}
            </DialogTitle>
            <p className="text-muted-foreground text-sm">
              {mode === 'create' 
                ? 'Break down your work into manageable tasks.'
                : 'Update your task details to stay on track.'}
            </p>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                placeholder="E.g., Complete Math Exercise 7.5"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="h-10 bg-background/50 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add any important details..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="bg-background/50 backdrop-blur-sm resize-none"
              />
            </div>

            {/* Removed priority field */}

            <div className="space-y-2 col-span-1">
              <Label>Subject</Label>
              <RadioGroup
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                className="flex flex-wrap gap-4"
              >
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <RadioGroupItem value={category} id={category} />
                    <Label 
                      htmlFor={category} 
                      className="text-sm px-2 py-0.5 rounded bg-primary/5"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2 col-span-1">
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <div className="relative">
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate || ''}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value || undefined })}
                  className="pl-10 h-10 bg-background/50 backdrop-blur-sm"
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <motion.div 
              className="flex justify-end gap-3 col-span-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="px-4"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="px-4 bg-primary/90 hover:bg-primary"
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
