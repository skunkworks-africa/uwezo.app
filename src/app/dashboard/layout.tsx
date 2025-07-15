
"use client";

import { createContext, useState, useMemo, useContext } from "react";
import Header from "@/components/layout/header";
import type { Task } from "@/app/dashboard/page";

const initialTasks: Task[] = [
  { id: 1, title: "Review and Sign NDA", completed: false },
  { id: 2, title: "Upload CV for Skill Analysis", completed: false },
  { id: 3, title: "Complete Profile Information", completed: false },
  { id: 4, title: "Meet your onboarding buddy", completed: false },
];

interface DashboardContextType {
  tasks: Task[];
  handleTaskCompletionChange: (taskId: number, completed: boolean) => void;
  progressPercentage: number;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

  const value = {
    tasks,
    handleTaskCompletionChange,
    progressPercentage,
  };

  return (
    <DashboardContext.Provider value={value}>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <footer className="border-t mt-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} Wezo. All rights reserved.
          </div>
        </footer>
      </div>
    </DashboardContext.Provider>
  )
}
