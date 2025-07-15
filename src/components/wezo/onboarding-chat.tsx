
"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, User, Bot, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id?: string;
  text: string;
  senderId: string;
  timestamp: any;
  senderName: string;
  senderPhotoURL?: string;
}

const ONBOARDING_BUDDY_ID = "onboardingBuddy";
const ONBOARDING_BUDDY_NAME = "Onboarding Buddy";

export function OnboardingChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [chatId, setChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const getOrCreateChat = async () => {
      const sortedIds = [user.uid, ONBOARDING_BUDDY_ID].sort();
      const newChatId = sortedIds.join("_");
      setChatId(newChatId);

      const chatRef = doc(db, "chats", newChatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          participants: [user.uid, ONBOARDING_BUDDY_ID],
          participantNames: {
            [user.uid]: user.displayName,
            [ONBOARDING_BUDDY_ID]: ONBOARDING_BUDDY_NAME,
          },
          lastMessage: null,
        });
      }
    };

    getOrCreateChat();
  }, [user]);

  useEffect(() => {
    if (!chatId) return;

    setIsLoading(true);
    const messagesQuery = query(collection(db, "chats", chatId, "messages"), orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages: ChatMessage[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
      setMessages(newMessages);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching messages:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || !chatId) return;

    const messageData: ChatMessage = {
      text: input.trim(),
      senderId: user.uid,
      timestamp: serverTimestamp(),
      senderName: user.displayName || "User",
      senderPhotoURL: user.photoURL || undefined,
    };
    
    setInput("");

    try {
      await addDoc(collection(db, "chats", chatId, "messages"), messageData);
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally, show a toast notification
    }
  };

  return (
    <Card className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><MessageCircle /> Chat with your Buddy</CardTitle>
        <CardDescription>
          Get help and answers from your assigned onboarding buddy.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-grow pr-4 -mr-4">
          <div className="space-y-4 pr-4">
            {isLoading ? (
                 <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : messages.length === 0 ? (
                <div className="text-center text-muted-foreground p-8">
                    <p>No messages yet. Say hello!</p>
                </div>
            ) : (
              messages.map((message) => {
                const isUser = message.senderId === user?.uid;
                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-end gap-2",
                      isUser ? "justify-end" : "justify-start"
                    )}
                  >
                    {!isUser && (
                        <Avatar className="h-8 w-8 border">
                            <AvatarFallback className="bg-primary/20">
                                <Bot className="h-5 w-5" />
                            </AvatarFallback>
                        </Avatar>
                    )}
                    <div
                      className={cn(
                        "p-3 rounded-lg max-w-[80%] whitespace-pre-wrap shadow-sm",
                        isUser
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted rounded-bl-none"
                      )}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                     {isUser && (
                        <Avatar className="h-8 w-8 border">
                             <AvatarFallback>
                                {user?.displayName?.[0]?.toUpperCase() || <User className="h-5 w-5" />}
                            </AvatarFallback>
                        </Avatar>
                     )}
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t pt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={!chatId || !user}
            className="flex-grow"
            autoComplete="off"
          />
          <Button type="submit" disabled={!input.trim() || !chatId || !user} size="icon" aria-label="Send message">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
