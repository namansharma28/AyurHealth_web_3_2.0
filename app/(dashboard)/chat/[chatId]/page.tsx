"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { useChatStore } from "@/lib/store";
import { getAyurvedicAdvice } from "@/lib/gemini";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function ChatPage() {
  const params = useParams<{ chatId: string }>();
  const chatId = params.chatId as string;
  const { getChat, addMessage, fetchChats } = useChatStore();
  const [isPending, setIsPending] = useState(false);
  
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);
  
  const chat = getChat(chatId);
  
  const handleSendMessage = async (message: string) => {
    if (isPending) return;
    
    setIsPending(true);
    
    try {
      const response = await getAyurvedicAdvice(message);
      await addMessage(chatId, response, "assistant");
    } catch (error) {
      console.error("Failed to get AI response:", error);
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsPending(false);
    }
  };
  
  useEffect(() => {
    const autoRespond = async () => {
      if (chat && chat.messages.length === 1 && chat.messages[0].role === "user") {
        handleSendMessage(chat.messages[0].content);
      }
    };
    
    autoRespond();
  }, [chat]);
  
  if (!chat) return null;
  
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-3 p-4 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <Link href="/chat">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            {chat.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {chat.messages.length} messages
          </p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto  bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-900 dark:to-gray-950">
        <ChatMessages chatId={chatId} isPending={isPending} />
      </div>
      
      <ChatInput 
        chatId={chatId} 
        onSend={handleSendMessage} 
        disabled={isPending}
        placeholder="Ask for Ayurvedic advice..."
      />
    </div>
  );
}