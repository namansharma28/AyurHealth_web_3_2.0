"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Brain, AlertCircle, TrendingUp, Target, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useChatStore, useWellnessStore } from "@/lib/store";

interface HealthReport {
  healthState: string;
  doshaCharacteristics: string[];
  concerns: string[];
  trends: string[];
  attentionAreas: string[];
}

export default function ReportPage() {
  const [report, setReport] = useState<HealthReport | null>(null);
  const [loading, setLoading] = useState(true);
  const { chats } = useChatStore();
  const { checkIns } = useWellnessStore();

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user');
      if (!response.ok) throw new Error('Failed to fetch user data');
      
      const userData = await response.json();
      
      // Get recent data
      const recentChats = chats.slice(0, 5);
      const recentCheckIns = checkIns.slice(0, 5);
      
      const context = {
        profile: userData.profile || {},
        bodyNature: userData.bodyNature,
        recentChats,
        recentCheckIns
      };

      const analysisResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context),
      });

      if (!analysisResponse.ok) throw new Error('Failed to analyze health data');
      
      const analysis = await analysisResponse.json();
      setReport(analysis);
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error('Failed to generate health report');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container p-6 max-w-5xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 dark:text-green-400" />
          <p className="text-muted-foreground">Analyzing your health data...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container p-6 max-w-5xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-amber-500 mx-auto" />
              <h2 className="text-xl font-semibold">No Report Available</h2>
              <p className="text-muted-foreground">
                Complete your profile and continue using the app to generate a health report.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent mb-8">
        Health Report
      </h1>

      <div className="grid gap-6">
        {/* Health State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden border-green-200 dark:border-green-900">
            <CardHeader className="bg-gradient-to-r from-green-500/10 to-teal-500/10 dark:from-green-500/20 dark:to-teal-500/20">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                Current Health State
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-lg">{report.healthState}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dosha Characteristics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Dosha Characteristics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {report.doshaCharacteristics.map((characteristic, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
                  >
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    <span>{characteristic}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Health Concerns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                Health Concerns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {report.concerns.map((concern, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg"
                  >
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    <span>{concern}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Wellness Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Wellness Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {report.trends.map((trend, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                  >
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span>{trend}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Areas Needing Attention */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-red-600 dark:text-red-400" />
                Areas Needing Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {report.attentionAreas.map((area, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                  >
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span>{area}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}