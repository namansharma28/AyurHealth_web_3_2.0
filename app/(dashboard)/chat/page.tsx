"use client";

import { useEffect, useState } from "react";
import { useChatStore, useWellnessStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquarePlus, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

export default function ChatPage() {
  const { chats, fetchChats } = useChatStore();
  const { shouldPromptNewCheckIn, fetchCheckIns } = useWellnessStore();
  const [showPrompt, setShowPrompt] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    fetchChats();
    fetchCheckIns();
  }, [fetchChats, fetchCheckIns]);
  
  useEffect(() => {
    setShowPrompt(shouldPromptNewCheckIn());
  }, [shouldPromptNewCheckIn]);
  
  return (
    <div className="container p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent">
          Your Conversations
        </h1>
        <Link href="/chat/new">
          <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </Link>
      </div>
      
      {showPrompt && (
        <Card className="mb-8 border-teal-200 dark:border-teal-900 bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-900/30 dark:to-green-900/30 p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-teal-900 dark:text-teal-100">It's a new day!</h2>
              <p className="text-teal-800 dark:text-teal-200 mt-1">Start your daily wellness check-in to receive personalized Ayurvedic advice.</p>
            </div>
            <Button 
              onClick={() => router.push('/chat/new')}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              Start Daily Check-in
            </Button>
          </div>
        </Card>
      )}
      
      {chats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mb-4">
            <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No conversations yet</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Start your wellness journey by beginning a new conversation with your Ayurvedic advisor.
          </p>
          <Link href="/chat/new">
            <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
              <MessageSquarePlus className="mr-2 h-4 w-4" />
              Start Your First Conversation
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chats.map((chat) => (
            <Link key={chat._id || chat.id} href={`/chat/${chat._id || chat.id}`}>
              <Card className="h-full cursor-pointer hover:shadow-md transition-shadow border-gray-200 dark:border-gray-800 overflow-hidden group">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {chat.title}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(new Date(chat.createdAt))}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.messages.length > 0 
                      ? chat.messages[chat.messages.length - 1].content.substring(0, 100) 
                      : "No messages yet"}
                  </p>
                </div>
                <div className="px-6 py-3 bg-muted/50 border-t text-xs text-muted-foreground">
                  {chat.messages.length} {chat.messages.length === 1 ? "message" : "messages"}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}