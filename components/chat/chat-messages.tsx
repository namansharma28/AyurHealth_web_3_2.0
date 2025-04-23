"use client";

import { useEffect, useRef } from "react";
import { UserAvatar } from "@/components/chat/user-avatar";
import { BotAvatar } from "@/components/chat/bot-avatar";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/lib/store";
import { useMessageSounds } from "@/lib/sounds";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from "framer-motion";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ChatMessagesProps {
  chatId: string;
  isPending?: boolean;
  className?: string;
}

export function ChatMessages({ 
  chatId,
  isPending = false,
  className
}: ChatMessagesProps) {
  const { getChat } = useChatStore();
  const chat = getChat(chatId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { playMessageIn } = useMessageSounds();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
    if (chat?.messages.length && chat.messages[chat.messages.length - 1].role === 'assistant') {
      playMessageIn();
    }
  }, [chat?.messages, playMessageIn]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };
  
  if (!chat) return null;
  
  return (
    <div className={cn("flex flex-col mr-auto ml-auto max-w-[85%] gap-6 px-4 py-6 ", className)}>
      <AnimatePresence initial={false}>
        {chat.messages.map((message, index) => (
          <motion.div 
            key={message.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "group relative max-w-[85%]",
              message.role === "user" ? "ml-auto" : "mr-auto"
            )}
          >
            <div className={cn(
              "flex gap-3 p-8 rounded-2xl",
              message.role === "user" 
                ? "bg-gradient-to-r from-green-500 to-teal-500 text-white flex-row-reverse" 
                : "bg-card border shadow-sm"
            )}>
              <div className="flex-shrink-0">
                {message.role === "user" ? (
                  <UserAvatar />
                ) : (
                  <BotAvatar />
                )}
              </div>
              <div className={cn(
                "flex-1 overflow-hidden space-y-2",
                message.role === "user" ? "text-left" : "text-left"
              )}>
                <div className={cn(
                  "font-medium text-sm",
                  message.role === "user" ? "text-white/90" : "text-muted-foreground"
                )}>
                  {message.role === "user" ? "You" : "AyurHealth.AI"}
                </div>
                <div className={cn(
                  "prose max-w-none",
                  message.role === "user" ? "dark:prose-invert prose-white" : "dark:prose-invert"
                )}>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({node, ...props}) => (
                        <p className={cn(
                          "text-sm mb-2 last:mb-0",
                          message.role === "user" ? "text-white/90" : ""
                        )} {...props} />
                      ),
                      h1: ({node, ...props}) => (
                        <h1 className={cn(
                          "text-xl font-bold mb-3",
                          message.role === "user" ? "text-white" : ""
                        )} {...props} />
                      ),
                      h2: ({node, ...props}) => (
                        <h2 className={cn(
                          "text-lg font-semibold mb-2",
                          message.role === "user" ? "text-white" : ""
                        )} {...props} />
                      ),
                      h3: ({node, ...props}) => (
                        <h3 className={cn(
                          "text-base font-medium mb-2",
                          message.role === "user" ? "text-white" : ""
                        )} {...props} />
                      ),
                      ul: ({node, ...props}) => (
                        <ul className={cn(
                          "list-disc list-inside mb-2",
                          message.role === "user" ? "text-white/90" : ""
                        )} {...props} />
                      ),
                      ol: ({node, ...props}) => (
                        <ol className={cn(
                          "list-decimal list-inside mb-2",
                          message.role === "user" ? "text-white/90" : ""
                        )} {...props} />
                      ),
                      li: ({node, ...props}) => (
                        <li className={cn(
                          "mb-1",
                          message.role === "user" ? "text-white/90" : ""
                        )} {...props} />
                      ),
                      code: ({node, ...props}) => (
                        <code className={cn(
                          "px-1.5 py-0.5 rounded-md text-sm font-mono",
                          message.role === "user" 
                            ? "bg-white/20 text-white" 
                            : "bg-muted"
                        )} {...props} />
                      ),
                      pre: ({node, children, ...props}) => (
                        <div className="relative group">
                          <pre className={cn(
                            "px-4 py-3 rounded-lg overflow-x-auto mb-2 text-sm font-mono",
                            message.role === "user" 
                              ? "bg-white/20" 
                              : "bg-muted"
                          )} {...props}>
                            {children}
                          </pre>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity",
                              message.role === "user" 
                                ? "text-white hover:text-white/80 hover:bg-white/20" 
                                : ""
                            )}
                            onClick={() => copyToClipboard(children?.toString() || "")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      ),
                      blockquote: ({node, ...props}) => (
                        <blockquote className={cn(
                          "border-l-4 pl-4 italic mb-2",
                          message.role === "user" 
                            ? "border-white/30 text-white/90" 
                            : "border-muted"
                        )} {...props} />
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex w-full max-w-[85%] gap-3 p-4 rounded-2xl bg-card border shadow-sm"
          >
            <div className="flex-shrink-0">
              <BotAvatar />
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm text-muted-foreground mb-2">AyurHealth.AI</div>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex gap-1.5"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="w-2 h-2 bg-green-500 rounded-full" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div ref={messagesEndRef} />
    </div>
  );
}