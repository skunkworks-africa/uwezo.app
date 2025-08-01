
"use client";

import type { Task } from "@/app/dashboard/page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onTaskCompletionChange: (taskId: number, completed: boolean) => void;
}

export function TaskList({ tasks, onTaskCompletionChange }: TaskListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Onboarding Tasks</CardTitle>
        <CardDescription>Complete these tasks to finish your onboarding.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map((task) => {
            const labelId = `task-label-${task.id}`;
            return (
              <div
                key={task.id}
                className={cn(
                  "flex items-center p-4 rounded-lg border-2 transition-all",
                  task.completed ? "bg-primary/5 border-primary/20" : "bg-card hover:bg-muted/50"
                )}
              >
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={(checked) =>
                    onTaskCompletionChange(task.id, !!checked)
                  }
                  className="mr-4 h-6 w-6"
                  aria-labelledby={labelId}
                />
                <Label
                  htmlFor={`task-${task.id}`}
                  id={labelId}
                  className={cn(
                    "flex-grow text-base cursor-pointer",
                    task.completed && "line-through text-muted-foreground"
                  )}
                >
                  {task.title}
                </Label>
                {task.completed ? (
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                ) : (
                  <Circle className="h-6 w-6 text-muted-foreground/30" />
                )}
              </div>
            )
        })}
      </CardContent>
    </Card>
  );
}
