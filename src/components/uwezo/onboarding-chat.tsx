
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const ONBOARDING_BUDDY_NAME = "Onboarding Buddy";
const ONBOARDING_BUDDY_WHATSAPP_NUMBER = "+27686493591"; // The provided number

export function OnboardingChat() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim() || !user) return;

    const encodedMessage = encodeURIComponent(message);
    // Remove '+' and spaces from the phone number
    const formattedNumber = ONBOARDING_BUDDY_WHATSAPP_NUMBER.replace(/\s/g, "").replace("+", "");
    
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><MessageCircle /> Chat with your Buddy</CardTitle>
        <CardDescription>
          Get help and answers from your assigned onboarding buddy via WhatsApp.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <div className="space-y-4 flex-grow">
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
             <Avatar className="h-12 w-12 border">
                <AvatarFallback className="bg-primary/20">
                    <Bot className="h-6 w-6" />
                </AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold">{ONBOARDING_BUDDY_NAME}</p>
                <p className="text-sm text-muted-foreground">Ready to help!</p>
            </div>
          </div>
           <div className="text-center text-muted-foreground p-4">
                <p>Type your message below and send it directly on WhatsApp.</p>
            </div>
        </div>
        <div className="space-y-2">
           <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={!user}
            className="flex-grow min-h-[100px]"
            autoComplete="off"
          />
          <Button onClick={handleSend} disabled={!message.trim() || !user} className="w-full">
            Send on WhatsApp
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
