"use client";

import { useState, useMemo } from "react";
import { AiAssistant } from "@/components/wezo/ai-assistant";
import { DocumentUploader } from "@/components/wezo/document-uploader";
import { ProgressTracker } from "@/components/wezo/progress-tracker";
import { TaskList } from "@/components/wezo/task-list";
import { NdaViewer } from "@/components/wezo/nda-viewer";

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const initialTasks: Task[] = [
  { id: 1, title: "Review and Sign NDA", completed: false },
  { id: 2, title: "Upload CV for Skill Analysis", completed: false },
  { id: 3, title: "Complete Profile Information", completed: false },
  { id: 4, title: "Meet your onboarding buddy", completed: false },
];


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
  
  const handleNdaSigned = () => {
    handleTaskCompletionChange(1, true);
  };
  
  const handleCvAnalyzed = () => {
    handleTaskCompletionChange(2, true);
  }

  return (
    <div className="space-y-8">
        <ProgressTracker progress={progressPercentage} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
            <TaskList tasks={tasks} onTaskCompletionChange={handleTaskCompletionChange} />
            <NdaViewer onSigned={handleNdaSigned} />
            <DocumentUploader onAnalysisComplete={handleCvAnalyzed} />
        </div>
        
        <div className="lg:col-span-1 lg:sticky lg:top-24">
            <AiAssistant />
        </div>
        </div>
    </div>
  );
}
