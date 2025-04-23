import { auth } from "@clerk/nextjs";
import { ArrowRight, MessageSquare, LineChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import { DietPlan } from "@/components/dashboard/diet-plan";
import { BMIMeter } from "@/components/dashboard/bmi-meter";
import { BodyNature } from "@/components/dashboard/body-nature";
import { WellnessRecommendations } from "@/components/dashboard/wellness-recommendations";

export default function DashboardPage() {
  const { userId } = auth();
  const currentDate = new Date();
  
  return (
    <div className="container p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent">Welcome to AyurHealth.AI</h1>
          <p className="text-muted-foreground mt-1">Your personal Ayurvedic wellness companion</p>
        </div>
        <p className="text-muted-foreground">{formatDate(currentDate)}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="overflow-hidden border-green-200 dark:border-green-900">
          <CardHeader className="bg-gradient-to-r from-green-500/10 to-teal-500/10 dark:from-green-500/20 dark:to-teal-500/20">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span>Daily Check-in</span>
            </CardTitle>
            <CardDescription>Share how you're feeling today</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p>Regular check-ins help us provide more personalized Ayurvedic advice tailored to your current state of wellbeing.</p>
          </CardContent>
          <CardFooter>
            <Link href="/chat/new" className="w-full">
              <Button className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                Start Today's Check-in
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <BMIMeter />
      </div>

      <div className="space-y-8">
        <BodyNature />
        <DietPlan />
        <WellnessRecommendations />
      </div>
    </div>
  );
}