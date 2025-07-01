"use client";

import { useState, useMemo } from "react";
import { AiAssistant } from "@/components/wezo/ai-assistant";
import { DocumentUploader } from "@/components/wezo/document-uploader";
import { ProgressTracker } from "@/components/wezo/progress-tracker";
import { TaskList } from "@/components/wezo/task-list";

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

// Per your request, the app no longer contains sample data.
const initialTasks: Task[] = [];

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleTaskCompletionChange = (taskId: number, completed: boolean) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed } : task
      )
    );
  };

  const completedTasks = useMemo(() => tasks.filter((task) => task.completed).length, [tasks]);
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8">
        <ProgressTracker progress={progressPercentage} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
            <TaskList tasks={tasks} onTaskCompletionChange={handleTaskCompletionChange} />
            <DocumentUploader />
        </div>
        
        <div className="lg:col-span-1 lg:sticky lg:top-24">
            <AiAssistant />
        </div>
        </div>
    </div>
  );
}
