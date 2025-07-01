"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, Users, Code, TrendingUp, BrainCircuit, RotateCcw } from "lucide-react";

type AnswerType = "technical" | "sales" | "team" | "solo" | "balanced";

const quizQuestions = [
  {
    question: "A complex, unsolved problem lands on your desk. What's your first move?",
    options: [
      { text: "Analyze all available data to understand the scope.", type: "technical" },
      { text: "Talk to stakeholders to understand their needs and pain points.", type: "sales" },
      { text: "Brainstorm a variety of potential solutions with a team.", type: "team" },
      { text: "Break it down into smaller, manageable parts to tackle alone.", type: "solo" },
    ],
  },
  {
    question: "You're most productive and energized when you are...",
    options: [
      { text: "Deeply focused, working alone on a challenging task.", type: "solo" },
      { text: "Collaborating and bouncing ideas off of colleagues.", type: "team" },
      { text: "Presenting a solution or product to an engaged audience.", type: "sales" },
      { text: "Building and debugging a complex system.", type: "technical" },
    ],
  },
  {
    question: "What's the most rewarding part of completing a project?",
    options: [
      { text: "Seeing the client or customer delighted with the result.", type: "sales" },
      { text: "Solving a difficult technical challenge that others couldn't.", type: "technical" },
      { text: "Achieving a shared goal through successful teamwork.", type: "team" },
      { text: "Knowing you've built a robust and well-designed system.", type: "balanced" },
    ],
  },
  {
    question: "How do you prefer to learn a new professional skill?",
    options: [
      { text: "By diving into documentation and technical articles.", type: "technical" },
      { text: "Through hands-on experimentation and building things.", type: "solo" },
      { text: "By shadowing a mentor or collaborating with an expert.", type: "team" },
      { text: "By understanding how it solves a customer or market need.", type: "sales" },
    ],
  },
  {
    question: "When faced with a tight deadline, you are most likely to:",
    options: [
      { text: "Prioritize tasks and focus on delivering the core features.", type: "balanced" },
      { text: "Rally the team to divide the work and collaborate efficiently.", type: "team" },
      { text: "Negotiate the scope or deadline with stakeholders.", type: "sales" },
      { text: "Work longer hours independently to ensure technical quality.", type: "solo" },
    ],
  },
];

const personas: Record<string, { title: string; description: string; icon: React.ReactNode }> = {
  technical_solo: { title: "The Specialist", description: "You are a deep-thinking problem-solver who excels at tackling complex technical challenges independently.", icon: <Code className="h-12 w-12 text-primary" /> },
  technical_team: { title: "The Innovator", description: "You combine technical expertise with a collaborative spirit, thriving when building cutting-edge solutions with a team.", icon: <Lightbulb className="h-12 w-12 text-primary" /> },
  sales_team: { title: "The Influencer", description: "You are a natural leader and communicator, skilled at rallying teams and connecting with people to drive results.", icon: <Users className="h-12 w-12 text-primary" /> },
  sales_solo: { title: "The Trailblazer", description: "You are a self-motivated driver of growth, adept at forging your own path to connect with and understand customer needs.", icon: <TrendingUp className="h-12 w-12 text-primary" /> },
  balanced: { title: "The Versatile Pro", description: "You are an adaptable and well-rounded professional, capable of balancing technical aspects, teamwork, and stakeholder needs.", icon: <BrainCircuit className="h-12 w-12 text-primary" /> },
};


export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerType>>({});
  const [showResult, setShowResult] = useState(false);
  const [resultPersona, setResultPersona] = useState(personas.balanced);

  const handleAnswerSelect = (questionIndex: number, type: AnswerType) => {
    setAnswers({ ...answers, [questionIndex]: type });
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = () => {
    const counts: Record<string, number> = { technical: 0, sales: 0, team: 0, solo: 0, balanced: 0 };
    Object.values(answers).forEach(type => {
      counts[type] = (counts[type] || 0) + 1;
    });

    if (counts.balanced > 1) {
      setResultPersona(personas.balanced);
    } else {
      const primaryType = counts.technical > counts.sales ? "technical" : "sales";
      const secondaryType = counts.team > counts.solo ? "team" : "solo";
      setResultPersona(personas[`${primaryType}_${secondaryType}`] || personas.balanced);
    }
    
    setShowResult(true);
  };
  
  const handleRetake = () => {
      setCurrentQuestion(0);
      setAnswers({});
      setShowResult(false);
  }

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const isAnswerSelected = answers[currentQuestion] !== undefined;

  if (showResult) {
      return (
        <div className="flex items-center justify-center py-12">
            <Card className="w-full max-w-2xl text-center">
                <CardHeader>
                    <CardTitle className="text-3xl">Your Aptitude Profile</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                    <div className="p-6 bg-primary/10 rounded-full">
                       {resultPersona.icon}
                    </div>
                    <h2 className="text-2xl font-semibold text-primary">{resultPersona.title}</h2>
                    <p className="text-lg text-muted-foreground px-4">{resultPersona.description}</p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button onClick={handleRetake}><RotateCcw className="mr-2 h-4 w-4"/> Retake Quiz</Button>
                </CardFooter>
            </Card>
        </div>
      )
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Aptitude Quiz</CardTitle>
          <CardDescription>
            Answer these questions to help us understand your work style. ({currentQuestion + 1} of {quizQuestions.length})
          </CardDescription>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <h2 className="text-lg font-semibold">{quizQuestions[currentQuestion].question}</h2>
          <RadioGroup 
            value={answers[currentQuestion]}
            onValueChange={(value) => handleAnswerSelect(currentQuestion, value as AnswerType)}
            className="space-y-2"
          >
            {quizQuestions[currentQuestion].options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option.type} id={`q${currentQuestion}-o${index}`} />
                <Label htmlFor={`q${currentQuestion}-o${index}`} className="cursor-pointer">{option.text}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-end">
          {currentQuestion < quizQuestions.length - 1 ? (
            <Button onClick={handleNext} disabled={!isAnswerSelected}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!isAnswerSelected}>Submit</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
