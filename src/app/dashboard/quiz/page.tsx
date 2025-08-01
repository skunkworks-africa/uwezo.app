
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, RotateCcw, XCircle, Loader2 } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useDashboard } from "../layout";

type QuizQuestion = {
  section: string;
  question: string;
  options: string[];
  correctAnswer: string;
};

const quizQuestions: QuizQuestion[] = [
  // Verbal Reasoning
  {
    section: "Verbal Reasoning",
    question: "Despite the ___ weather, the event was a huge success.",
    options: ["inclement", "rigid", "festive", "remote"],
    correctAnswer: "inclement",
  },
  {
    section: "Verbal Reasoning",
    question: "The new policy was implemented to ___ efficiency.",
    options: ["exacerbate", "bolster", "diminish", "obfuscate"],
    correctAnswer: "bolster",
  },
  {
    section: "Verbal Reasoning",
    question: "Choose the word that is most nearly opposite in meaning to 'sparse'.",
    options: ["abundant", "scarce", "thin", "rare"],
    correctAnswer: "abundant",
  },
  {
    section: "Verbal Reasoning",
    question: "The manager's ___ speech motivated the entire team.",
    options: ["eloquent", "mundane", "convoluted", "abrupt"],
    correctAnswer: "eloquent",
  },
  {
    section: "Verbal Reasoning",
    question: "Identify the word that does not belong: apple, banana, carrot, grape.",
    options: ["apple", "banana", "carrot", "grape"],
    correctAnswer: "carrot",
  },
  {
    section: "Verbal Reasoning",
    question: "The report was criticized for being too ___ and lacking specific details.",
    options: ["nebulous", "precise", "concise", "lucid"],
    correctAnswer: "nebulous",
  },
  {
    section: "Verbal Reasoning",
    question: "'Ubiquitous' means:",
    options: ["rare", "present everywhere", "complex", "simple"],
    correctAnswer: "present everywhere",
  },
  {
    section: "Verbal Reasoning",
    question: "A synonym for 'diligent' is:",
    options: ["lazy", "careless", "hardworking", "quick"],
    correctAnswer: "hardworking",
  },

  // Numerical Reasoning
  {
    section: "Numerical Reasoning",
    question: "If a service costs $120 and is discounted by 25%, what is the final price?",
    options: ["$90", "$95", "$100", "$85"],
    correctAnswer: "$90",
  },
  {
    section: "Numerical Reasoning",
    question: "A car travels at 60 km/h. How far will it travel in 2.5 hours?",
    options: ["120 km", "150 km", "180 km", "140 km"],
    correctAnswer: "150 km",
  },
  {
    section: "Numerical Reasoning",
    question: "The ratio of managers to employees is 2:7. If there are 21 employees, how many managers are there?",
    options: ["4", "6", "8", "5"],
    correctAnswer: "6",
  },
  {
    section: "Numerical Reasoning",
    question: "What is 15% of 300?",
    options: ["30", "45", "50", "60"],
    correctAnswer: "45",
  },
   {
    section: "Numerical Reasoning",
    question: "If a project's budget is $5,000 and the team has spent $3,500, what percentage of the budget remains?",
    options: ["25%", "30%", "35%", "40%"],
    correctAnswer: "30%",
  },
  {
    section: "Numerical Reasoning",
    question: "A product's price increased from $50 to $60. What was the percentage increase?",
    options: ["10%", "15%", "20%", "25%"],
    correctAnswer: "20%",
  },
  {
    section: "Numerical Reasoning",
    question: "The average of three numbers is 20. If two numbers are 15 and 25, what is the third number?",
    options: ["10", "20", "30", "18"],
    correctAnswer: "20",
  },
  {
    section: "Numerical Reasoning",
    question: "Sales for a company were $200k in Q1 and $250k in Q2. What is the percentage growth?",
    options: ["20%", "25%", "30%", "50%"],
    correctAnswer: "25%",
  },
  
  // Logical Thinking
  {
    section: "Logical Thinking",
    question: "What comes next in the series: 2, 6, 12, 20, ?",
    options: ["30", "26", "28", "24"],
    correctAnswer: "30",
  },
  {
    section: "Logical Thinking",
    question: "If all cats have tails and Fluffy is a cat, then:",
    options: ["Fluffy might have a tail", "Fluffy has a tail", "Fluffy cannot have a tail", "All animals with tails are cats"],
    correctAnswer: "Fluffy has a tail",
  },
  {
    section: "Logical Thinking",
    question: "Which shape is the odd one out in the sequence: Square, Triangle, Pentagon, Circle?",
    options: ["Square", "Triangle", "Pentagon", "Circle"],
    correctAnswer: "Circle",
  },
  {
    section: "Logical Thinking",
    question: "A is taller than B. C is shorter than A. Which statement must be true?",
    options: ["B is the shortest", "C is taller than B", "A is the tallest", "It cannot be determined"],
    correctAnswer: "It cannot be determined",
  },
    {
    section: "Logical Thinking",
    question: "Find the next item in the pattern: J, F, M, A, M, J, ?",
    options: ["J", "A", "S", "O"],
    correctAnswer: "J",
  },
  {
    section: "Logical Thinking",
    question: "If 'TEAM' is coded as 'MAET', how is 'WORK' coded?",
    options: ["KROW", "KORW", "ROWK", "OWRK"],
    correctAnswer: "KROW",
  },
  {
    section: "Logical Thinking",
    question: "Book is to Reading as Fork is to:",
    options: ["Drawing", "Writing", "Eating", "Stirring"],
    correctAnswer: "Eating",
  },
  {
    section: "Logical Thinking",
    question: "Statement: Some dogs are friendly. Statement: All friendly animals are pets. Conclusion?",
    options: ["All dogs are pets", "Some dogs are pets", "No dogs are pets", "All pets are dogs"],
    correctAnswer: "Some dogs are pets",
  },

  // Digital Literacy
  {
    section: "Digital Literacy",
    question: "Which of the following is a secure password?",
    options: ["123456", "Password2024", "Uwezo@!9#fG", "uwezo2025"],
    correctAnswer: "Uwezo@!9#fG",
  },
  {
    section: "Digital Literacy",
    question: "What does 'CC' stand for in an email?",
    options: ["Carbon Copy", "Creative Commons", "Closed Caption", "Company Correspondence"],
    correctAnswer: "Carbon Copy",
  },
  {
    section: "Digital Literacy",
    question: "Which file format is commonly used for high-quality printable documents?",
    options: [".JPG", ".GIF", ".PDF", ".MP3"],
    correctAnswer: ".PDF",
  },
    {
    section: "Digital Literacy",
    question: "What is 'phishing'?",
    options: ["A type of computer virus", "A method to securely encrypt data", "A fraudulent attempt to obtain sensitive information", "A way to cool down computer hardware"],
    correctAnswer: "A fraudulent attempt to obtain sensitive information",
  },
  {
    section: "Digital Literacy",
    question: "What is the function of a spreadsheet software like Excel or Google Sheets?",
    options: ["To write documents", "To create presentations", "To organize and analyze data in tables", "To edit videos"],
    correctAnswer: "To organize and analyze data in tables",
  },
  {
    section: "Digital Literacy",
    question: "Which of these is a cloud storage service?",
    options: ["Microsoft Word", "Google Drive", "Adobe Photoshop", "Mozilla Firefox"],
    correctAnswer: "Google Drive",
  },

  // Situational Judgment
  {
    section: "Situational Judgment",
    question: "A remote colleague is struggling to meet deadlines due to poor internet. What do you do?",
    options: ["Report to HR immediately", "Offer async support or help escalate for solutions", "Ignore; it's not your problem", "Tell the team they are inefficient"],
    correctAnswer: "Offer async support or help escalate for solutions",
  },
  {
    section: "Situational Judgment",
    question: "You notice a small mistake in a report just before a major client presentation. What is your most appropriate action?",
    options: ["Ignore it to avoid causing panic", "Quickly inform the presenter and suggest a correction", "Point it out during the presentation", "Blame the person who prepared the report"],
    correctAnswer: "Quickly inform the presenter and suggest a correction",
  },
  {
    section: "Situational Judgment",
    question: "Your team is discussing a new project, and you disagree with the proposed approach. You should:",
    options: ["Stay silent to avoid conflict", "Respectfully voice your concerns with alternative suggestions", "Wait to discuss it privately with your manager", "Agree but don't contribute to the work"],
    correctAnswer: "Respectfully voice your concerns with alternative suggestions",
  },
    {
    section: "Situational Judgment",
    question: "You receive an email that seems suspicious and asks for your login credentials. You should:",
    options: ["Reply with your credentials", "Click the link to see where it goes", "Delete the email and report it to IT/Security", "Forward it to your colleagues to warn them"],
    correctAnswer: "Delete the email and report it to IT/Security",
  },
  {
    section: "Situational Judgment",
    question: "A new team member from a different cultural background joins. The best way to ensure inclusivity is to:",
    options: ["Assume they will adapt on their own", "Only discuss work-related topics with them", "Make an effort to understand their perspective and include them in team activities", "Wait for them to initiate conversation"],
    correctAnswer: "Make an effort to understand their perspective and include them in team activities",
  },

  // Cognitive Adaptability
  {
    section: "Cognitive Adaptability",
    question: "You are given an unfamiliar tool during a Uwezo workshop. What's your approach?",
    options: ["Wait for help", "Watch a video tutorial", "Try it yourself and take notes", "Postpone the task"],
    correctAnswer: "Try it yourself and take notes",
  },
  {
    section: "Cognitive Adaptability",
    question: "A project's requirements suddenly change, making much of your work obsolete. How do you react?",
    options: ["Complain about the wasted time", "Analyze the new requirements and adapt your plan", "Continue with the old plan anyway", "Ask to be moved to a different project"],
    correctAnswer: "Analyze the new requirements and adapt your plan",
  },
  {
    section: "Cognitive Adaptability",
    question: "When faced with a complex problem you've never seen before, your first step is to:",
    options: ["Give up and escalate", "Search for an exact solution online", "Break the problem down into smaller, more manageable parts", "Guess a solution and hope for the best"],
    correctAnswer: "Break the problem down into smaller, more manageable parts",
  },
];


export default function QuizPage() {
  const { addQuizAttempt } = useUser();
  const { handleTaskCompletionChange, tasks } = useDashboard();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setAnswers({ ...answers, [questionIndex]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let correctAnswers = 0;
    quizQuestions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correctAnswers++;
      }
    });
    const finalScore = Math.round((correctAnswers / quizQuestions.length) * 100);
    setScore(finalScore);
    
    try {
        await addQuizAttempt({ score: finalScore, passed: finalScore >= 80 });
        const quizTask = tasks.find(t => t.title.includes("Aptitude Quiz"));
        if (quizTask) {
            handleTaskCompletionChange(quizTask.id, true);
        }
    } catch (error) {
        console.error("Failed to save quiz attempt:", error);
        // Optionally, show a toast to the user
    } finally {
        setIsSubmitting(false);
        setShowResult(true);
    }
  };
  
  const handleRetake = () => {
      setCurrentQuestion(0);
      setAnswers({});
      setScore(0);
      setShowResult(false);
      setIsSubmitting(false);
  }

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const isAnswerSelected = answers[currentQuestion] !== undefined;

  if (showResult) {
      const passed = score >= 80;
      return (
        <div className="flex items-center justify-center py-12">
            <Card className="w-full max-w-2xl text-center">
                <CardHeader>
                    <CardTitle className="text-3xl">Assessment Complete</CardTitle>
                    <CardDescription>Thank you for completing the assessment.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                    <div className={`p-4 rounded-full ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
                       {passed ? <CheckCircle className="h-16 w-16 text-green-600" /> : <XCircle className="h-16 w-16 text-red-600" />}
                    </div>
                    <p className="text-lg text-muted-foreground">Your Score:</p>
                    <h2 className={`text-6xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>{score}%</h2>
                    <p className={`text-lg font-semibold ${passed ? 'text-green-700' : 'text-red-700'}`}>
                        {passed ? "Congratulations! You've passed." : "Further review may be required."}
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button onClick={handleRetake}><RotateCcw className="mr-2 h-4 w-4"/> Retake Quiz</Button>
                </CardFooter>
            </Card>
        </div>
      )
  }

  const question = quizQuestions[currentQuestion];

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Uwezo Global Aptitude & Digital Readiness Assessment</CardTitle>
          <CardDescription>
            Section: <span className="font-semibold text-primary">{question.section}</span> | 
            Question {currentQuestion + 1} of {quizQuestions.length}
          </CardDescription>
          <Progress value={progress} className="mt-2 h-2" />
        </CardHeader>
        <CardContent className="space-y-6 px-8 py-6">
          <h2 className="text-xl font-semibold leading-relaxed">{question.question}</h2>
          <RadioGroup 
            value={answers[currentQuestion]}
            onValueChange={(value) => handleAnswerSelect(currentQuestion, value)}
            className="space-y-3"
          >
            {question.options.map((option, index) => (
              <Label key={index} htmlFor={`q${currentQuestion}-o${index}`} className="flex items-center space-x-3 p-4 border rounded-lg has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors cursor-pointer">
                <RadioGroupItem value={option} id={`q${currentQuestion}-o${index}`} />
                <span>{option}</span>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-4">
          {currentQuestion < quizQuestions.length - 1 ? (
            <Button onClick={handleNext} disabled={!isAnswerSelected}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!isAnswerSelected || isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
