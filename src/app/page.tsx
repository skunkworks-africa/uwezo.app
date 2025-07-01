"use client";

import { useState, useMemo } from "react";
import { Briefcase } from "lucide-react";
import { AiAssistant } from "@/components/wezo/ai-assistant";
import { DocumentUploader } from "@/components/wezo/document-uploader";
import { ProgressTracker } from "@/components/wezo/progress-tracker";
import { TaskList } from "@/components/wezo/task-list";

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const initialTasks: Task[] = [
  { id: 1, title: "Complete your employee profile", completed: true },
  { id: 2, title: "Sign the Non-Disclosure Agreement (NDA)", completed: false },
  { id: 3, title: "Set up your development environment", completed: false },
  { id: 4, title: "Review the company's code of conduct", completed: false },
  { id: 5, title: "Meet your onboarding buddy", completed: false },
];

export default function Home() {
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
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                 <Briefcase className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold">Wezo</h1>
            </div>
            <p className="text-muted-foreground hidden md:block">Welcome to your onboarding journey!</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
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
      </main>
      <footer className="border-t mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Wezo. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
