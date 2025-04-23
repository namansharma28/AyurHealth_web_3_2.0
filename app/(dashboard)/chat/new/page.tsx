"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getWellnessQuestions } from "@/lib/utils";
import { useChatStore, useWellnessStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function NewChatPage() {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const questions = getWellnessQuestions();
  const { createChat, addMessage } = useChatStore();
  const { addCheckIn, checkIns } = useWellnessStore();
  const router = useRouter();

  useEffect(() => {
    // Check if user has already checked in today
    const today = new Date().toISOString().split('T')[0];
    const hasCheckedInToday = checkIns.some(checkIn => {
      const checkInDate = new Date(checkIn.date).toISOString().split('T')[0];
      return checkInDate === today;
    });
    
    if (hasCheckedInToday) {
      setIsCheckedIn(true);
      toast.info("You've already completed your wellness check-in for today. Come back tomorrow!");
      router.push('/chat');
    }
  }, [checkIns, router]);
  
  const handleOptionSelect = (questionId: string, answer: string) => {
    setResponses({
      ...responses,
      [questionId]: answer
    });
  };
  
  const currentQuestion = questions[step];
  
  const handleNext = async () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      try {
        // Create a new chat with the responses
        const today = new Date().toISOString();
        const chatId = await createChat(`Wellness Check-in ${new Date().toLocaleDateString()}`);
        
        // Add the wellness check-in to the tracker
        await addCheckIn(today, responses);
        
        // Generate a message from the responses
        const message = `Hello! I'm having a wellness check-in today. Here's how I'm feeling:
${Object.entries(responses).map(([key, value]) => {
  const question = questions.find(q => q.id === key);
  return `- ${question?.question}: ${value}`;
}).join('\n')}

Based on this information, could you provide me with some Ayurvedic advice for today?`;
        
        // Add the message to the chat
        await addMessage(chatId, message, "user");
        
        // Redirect to the chat
        router.push(`/chat/${chatId}`);
      } catch (error) {
        console.error('Error creating chat:', error);
        toast.error('Failed to create chat. Please try again.');
      }
    }
  };
  
  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      router.push("/chat");
    }
  };
  
  const isNextDisabled = !responses[currentQuestion?.id];

  if (isCheckedIn) {
    return null; // Return null since we're redirecting
  }
  
  return (
    <div className="container p-6 max-w-2xl mx-auto">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={handleBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader className="bg-gradient-to-r from-green-500/10 to-teal-500/10 dark:from-green-500/20 dark:to-teal-500/20">
          <CardTitle>Daily Wellness Check-in</CardTitle>
          <CardDescription>
            Answer a few questions about how you're feeling today to get personalized advice
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Question {step + 1} of {questions.length}</span>
            <span className="text-sm font-medium">{Math.round(((step + 1) / questions.length) * 100)}%</span>
          </div>
          
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-8">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-teal-500 transition-all duration-300 ease-in-out"
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            />
          </div>
          
          <h3 className="text-xl font-medium mb-4">{currentQuestion?.question}</h3>
          
          <RadioGroup onValueChange={(value) => handleOptionSelect(currentQuestion?.id, value)}>
            <div className="space-y-3">
              {currentQuestion?.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option} 
                    id={option}
                    checked={responses[currentQuestion?.id] === option}
                  />
                  <Label htmlFor={option}>{option}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleNext}
            disabled={isNextDisabled}
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
          >
            {step < questions.length - 1 ? (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Complete Check-in"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}