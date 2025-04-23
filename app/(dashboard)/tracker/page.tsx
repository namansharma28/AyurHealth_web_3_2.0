"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWellnessStore } from "@/lib/store";
import { getWellnessQuestions } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format, subDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

export default function TrackerPage() {
  const { checkIns } = useWellnessStore();
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Get all dates with check-ins
  const checkInDates = checkIns.map(checkin => new Date(checkin.date).toDateString());
  
  // Prepare data for the visualization
  const questions = getWellnessQuestions();
  
  // Trend data for the past week
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return {
      date: format(date, 'MMM dd'),
      timestamp: date.toISOString(),
    };
  }).reverse();
  
  const trendData = past7Days.map(day => {
    const checkIn = checkIns.find(checkin => 
      new Date(checkin.date).toDateString() === new Date(day.timestamp).toDateString()
    );
    
    return {
      date: day.date,
      completed: checkIn ? 1 : 0,
    };
  });
  
  // Get selected day's check-in
  const selectedDayCheckIn = date 
    ? checkIns.find(checkin => 
        new Date(checkin.date).toDateString() === date.toDateString()
      )
    : null;
  
  return (
    <div className="container p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent mb-8">
        Wellness Tracker
      </h1>
      
      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Check-ins</CardTitle>
                <CardDescription>
                  View and manage your daily wellness check-ins
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md"
                  modifiers={{
                    completed: (date) => 
                      checkInDates.includes(date.toDateString()),
                  }}
                  modifiersClassNames={{
                    completed: "bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100",
                  }}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>
                  {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
                </CardTitle>
                <CardDescription>
                  {selectedDayCheckIn 
                    ? 'Check-in details for this day' 
                    : 'No check-in found for this date'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDayCheckIn ? (
                  <div className="space-y-4">
                    {questions.map((question) => (
                      <div key={question.id} className="border-b pb-3">
                        <h3 className="text-sm font-medium mb-1">{question.question}</h3>
                        <p className="text-base">{selectedDayCheckIn.responses[question.id] || 'Not answered'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground">
                      {date 
                        ? 'No wellness check-in found for this date.' 
                        : 'Select a date to view check-in details.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Consistency Tracker</CardTitle>
              <CardDescription>
                Track your wellness check-in consistency over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                      domain={[0, 1]}
                      ticks={[0, 1]}
                      tickFormatter={(value) => value === 1 ? 'Yes' : 'No'}
                    />
                    <Tooltip 
                      formatter={(value) => [value === 1 ? 'Completed' : 'Not completed', 'Check-in']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Bar 
                      dataKey="completed" 
                      fill="hsl(var(--chart-2))" 
                      radius={[4, 4, 0, 0]} 
                      name="Check-in Completed"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Your Progress</h3>
                <p className="text-muted-foreground">
                  {trendData.filter(d => d.completed === 1).length} out of 7 days with completed check-ins this week.
                </p>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden mt-2">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-teal-500"
                    style={{ width: `${(trendData.filter(d => d.completed === 1).length / 7) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}