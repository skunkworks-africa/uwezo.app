
"use client";

import { AiAssistant } from "@/components/wezo/ai-assistant";
import { DocumentUploader } from "@/components/wezo/document-uploader";
import { ProgressTracker } from "@/components/wezo/progress-tracker";
import { TaskList } from "@/components/wezo/task-list";
import { NdaViewer } from "@/components/wezo/nda-viewer";
import { useDashboard } from "./layout";
import { QuizHistory } from "@/components/wezo/quiz-history";
import { OnboardingChat } from "@/components/wezo/onboarding-chat";
import { VideoIntroduction } from "@/components/wezo/video-introduction";

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export default function DashboardPage() {
  const { tasks, handleTaskCompletionChange, progressPercentage } = useDashboard();
  
  const handleNdaSigned = () => {
    handleTaskCompletionChange(1, true);
  };
  
  const handleCvAnalyzed = () => {
    handleTaskCompletionChange(2, true);
  }

  const handleVideoRecorded = () => {
    handleTaskCompletionChange(5, true);
  }

  const handleQuizCompleted = () => {
    const quizTask = tasks.find(t => t.title.includes("Aptitude Quiz"));
    if (quizTask) {
        handleTaskCompletionChange(quizTask.id, true);
    }
  }

  return (
    <div className="space-y-8">
        <ProgressTracker progress={progressPercentage} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
                <TaskList tasks={tasks} onTaskCompletionChange={handleTaskCompletionChange} />
                <QuizHistory />
                <NdaViewer onSigned={handleNdaSigned} />
                <VideoIntroduction onRecordingComplete={handleVideoRecorded} />
                <DocumentUploader onAnalysisComplete={handleCvAnalyzed} />
            </div>
            
            <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-24">
                <AiAssistant />
                <OnboardingChat />
            </div>
        </div>
    </div>
  );
}
