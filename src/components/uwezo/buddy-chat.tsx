
"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useUser, ONBOARDING_BUDDY_UID, ONBOARDING_BUDDY_NAME, type ChatMessage } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Loader2, Send, User, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export function BuddyChat() {
  const { user } = useAuth();
  const { getOrCreateChat, sendMessage, useChatMessages } = useUser();
  const [chatId, setChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messages = useChatMessages(chatId);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      if (user) {
        const id = await getOrCreateChat();
        setChatId(id);
      }
    };
    initChat();
  }, [user, getOrCreateChat]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId || !user) return;

    setIsSending(true);
    const messageToSend = newMessage;
    setNewMessage("");

    try {
      await sendMessage(chatId, messageToSend);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optionally, show a toast notification
      setNewMessage(messageToSend); // Restore message on error
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <MessageCircle /> Chat with your Buddy
        </CardTitle>
        <CardDescription>
          Get help and answers from your assigned onboarding buddy.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-grow pr-4 -mr-4" ref={scrollAreaRef}>
          <div className="space-y-4 pr-4">
            {messages.length === 0 && (
                 <div className="text-center text-sm text-muted-foreground py-8">
                    No messages yet. Say hello!
                </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-end gap-3",
                  message.senderId === user?.uid ? "justify-end" : "justify-start"
                )}
              >
                {message.senderId !== user?.uid && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex flex-col gap-1 items-start max-w-[80%]">
                    <div
                        className={cn(
                            "p-3 rounded-lg whitespace-pre-wrap text-sm",
                            message.senderId === user?.uid
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-muted rounded-bl-none"
                        )}
                    >
                      <p>{message.text}</p>
                    </div>
                    <p className="text-xs text-muted-foreground px-1">
                        {message.timestamp ? formatDistanceToNow(message.timestamp.toDate(), { addSuffix: true }) : 'sending...'}
                    </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <form onSubmit={handleSend} className="flex items-center gap-2 border-t pt-4">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={!chatId || isSending}
            className="flex-grow"
            autoComplete="off"
          />
          <Button type="submit" disabled={!chatId || isSending || !newMessage.trim()} size="icon" aria-label="Send message">
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
