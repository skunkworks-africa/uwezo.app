
"use client";

import { useState, useRef, useEffect } from "react";
import { answerQuestion, type AiAssistantOutput } from "@/ai/flows/ai-assistant";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Loader2, Send, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { rtdb } from "@/lib/firebase";
import { ref, onValue, push, serverTimestamp } from "firebase/database";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AiAssistant() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!user) return;
    
    const sessionRef = ref(rtdb, `sessions/${user.uid}/promptHistory`);
    const unsubscribe = onValue(sessionRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const loadedMessages = Object.values(data) as Message[];
            setMessages(loadedMessages);
        } else {
            setMessages([]);
        }
    });

    return () => unsubscribe();

  }, [user]);


  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !user) return;

    const userMessage: Message = { role: "user", content: input };
    const sessionRef = ref(rtdb, `sessions/${user.uid}/promptHistory`);
    
    // Push user message to RTDB
    push(sessionRef, userMessage);
    
    const questionToAsk = input;
    setInput("");
    setIsLoading(true);

    try {
      const result: AiAssistantOutput = await answerQuestion({ question: questionToAsk });
      const assistantMessage: Message = { role: "assistant", content: result.answer };
      
      // Push assistant message to RTDB
      push(sessionRef, assistantMessage);

    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
       // Push error message to RTDB
      push(sessionRef, errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
      <CardHeader>
        <CardTitle>AI Onboarding Assistant</CardTitle>
        <CardDescription>
          Ask any question about the onboarding process. Your chat is saved.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-grow pr-4 -mr-4">
          <div className="space-y-4 pr-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "p-3 rounded-lg max-w-[80%] whitespace-pre-wrap",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                    <Avatar className="h-8 w-8 border">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="p-3 rounded-lg bg-muted flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                </div>
            )}
             <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t pt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., What is the dress code?"
            disabled={isLoading || !user}
            className="flex-grow"
            autoComplete="off"
          />
          <Button type="submit" disabled={isLoading || !input.trim() || !user} size="icon" aria-label="Send message">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
