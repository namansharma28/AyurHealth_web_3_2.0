"use client";

import { Button } from "@/components/ui/button";
import { Send, Mic, Paperclip } from "lucide-react";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useChatStore } from "@/lib/store";
import { useMessageSounds } from "@/lib/sounds";
import { motion } from "framer-motion";

interface ChatInputProps {
  chatId: string;
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  chatId, 
  onSend, 
  disabled = false,
  placeholder = "Type your message..."
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const { addMessage } = useChatStore();
  const { playMessageOut } = useMessageSounds();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || disabled) return;
    
    playMessageOut();
    await addMessage(chatId, message, "user");
    onSend(message);
    setMessage("");
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative border-t bg-background p-4  bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-4xl relative flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="flex-shrink-0"
          disabled={disabled}
        >
          <Paperclip className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">Attach file</span>
        </Button>

        <div className="relative flex-1">
          <TextareaAutosize
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            className="w-full resize-none rounded-2xl border bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            maxRows={5}
            disabled={disabled}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
        </div>

        <div className="flex flex-shrink-0 gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disabled}
          >
            <Mic className="h-5 w-5 text-muted-foreground" />
            <span className="sr-only">Voice input</span>
          </Button>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              type="submit"
              size="icon"
              className="bg-green-600 hover:bg-green-700 text-white" 
              disabled={disabled || !message.trim()}
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </form>
  );
}