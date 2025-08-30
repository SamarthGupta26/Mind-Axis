export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string; // ISO string
  category: string; // subject
  tags?: string[];
  priority?: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
}
