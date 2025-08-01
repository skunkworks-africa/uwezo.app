
"use client";

import { useUser, type QuizAttempt } from "@/hooks/use-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, CheckCircle2, History, Percent, XCircle } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Button } from "../ui/button";

export function QuizHistory() {
  const { quizAttempts, loadingUser } = useUser();

  if (loadingUser) {
    return <QuizHistorySkeleton />;
  }

  const latestAttempt = quizAttempts.length > 0 ? quizAttempts[0] : null;

  if (!latestAttempt) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BrainCircuit />Aptitude Quiz</CardTitle>
          <CardDescription>You haven't taken the aptitude quiz yet.</CardDescription>
        </CardHeader>
        <CardContent>
            <Button asChild>
                <Link href="/dashboard/quiz">Take the Quiz Now</Link>
            </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BrainCircuit />Aptitude Quiz</CardTitle>
        <CardDescription>Here's a summary of your latest assessment attempt.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-muted/50 rounded-lg flex flex-col items-center justify-center">
          <p className="text-sm font-medium text-muted-foreground mb-1">Latest Score</p>
          <div className="flex items-center gap-2">
            {latestAttempt.passed ? (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
            ) : (
                <XCircle className="h-6 w-6 text-red-500" />
            )}
            <p className="text-3xl font-bold">{latestAttempt.score}<span className="text-lg text-muted-foreground">%</span></p>
          </div>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg flex flex-col items-center justify-center">
          <p className="text-sm font-medium text-muted-foreground mb-1">Attempts</p>
          <div className="flex items-center gap-2">
            <History className="h-6 w-6 text-primary" />
            <p className="text-3xl font-bold">{quizAttempts.length}</p>
          </div>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg flex flex-col items-center justify-center">
          <p className="text-sm font-medium text-muted-foreground mb-1">Last Taken</p>
           <div className="flex items-center gap-2">
            <p className="text-lg font-semibold">
                {latestAttempt.timestamp ? formatDistanceToNow(latestAttempt.timestamp.toDate(), { addSuffix: true }) : 'N/A'}
            </p>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuizHistorySkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-4 w-3/4 mt-2" />
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </CardContent>
        </Card>
    )
}
