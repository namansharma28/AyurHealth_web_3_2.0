"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Brain, Activity, AlertTriangle, ChevronDown, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Recommendation {
  title: string;
  description: string;
  benefits: string[];
  instructions: string[];
  contraindications: string[];
}

interface WellnessRecommendations {
  mental: Recommendation[];
  physical: Recommendation[];
}

export function WellnessRecommendations() {
  const [recommendations, setRecommendations] = useState<WellnessRecommendations | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/wellness-recommendations');
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data?.recommendations || null);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async () => {
    try {
      setGenerating(true);
      const response = await fetch('/api/wellness-recommendations', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations);
        toast.success('Recommendations generated successfully');
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast.error('Failed to generate recommendations');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!recommendations) {
    return (
      <Card className="overflow-hidden border-green-200 dark:border-green-900">
        <CardHeader className="bg-gradient-to-r from-green-500/10 to-teal-500/10 dark:from-green-500/20 dark:to-teal-500/20">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span>Wellness Recommendations</span>
          </CardTitle>
          <CardDescription>Get personalized Ayurvedic wellness practices</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Button
            onClick={generateRecommendations}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
            disabled={generating}
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating recommendations...
              </>
            ) : (
              'Generate Recommendations'
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-green-200 dark:border-green-900">
      <CardHeader className="bg-gradient-to-r from-green-500/10 to-teal-500/10 dark:from-green-500/20 dark:to-teal-500/20">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
          <span>Wellness Recommendations</span>
        </CardTitle>
        <CardDescription>Your personalized Ayurvedic wellness practices</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 mt-4">
        {/* Mental Practices */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Brain className="h-5 w-5 text-purple-500" />
            Mental Wellness Practices
          </h3>
          {recommendations.mental.map((practice, index) => (
            <motion.div
              key={`mental-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-lg border bg-card"
            >
              <div 
                className="p-4 cursor-pointer"
                onClick={() => setExpandedItem(expandedItem === `mental-${index}` ? null : `mental-${index}`)}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{practice.title}</h4>
                  <ChevronDown 
                    className={`h-5 w-5 transition-transform duration-200 ${
                      expandedItem === `mental-${index}` ? 'rotate-180' : ''
                    }`} 
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{practice.description}</p>
              </div>

              <AnimatePresence>
                {expandedItem === `mental-${index}` && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Info className="h-4 w-4 text-blue-500" />
                          Benefits
                        </h5>
                        <ul className="grid gap-2">
                          {practice.benefits.map((benefit, i) => (
                            <li key={i} className="text-sm flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium mb-2">Instructions</h5>
                        <ol className="space-y-2">
                          {practice.instructions.map((instruction, i) => (
                            <li key={i} className="text-sm">
                              {i + 1}. {instruction}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {practice.contraindications.length > 0 && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                          <h5 className="text-sm font-medium mb-2 flex items-center gap-2 text-amber-900 dark:text-amber-100">
                            <AlertTriangle className="h-4 w-4" />
                            Precautions
                          </h5>
                          <ul className="space-y-1">
                            {practice.contraindications.map((warning, i) => (
                              <li key={i} className="text-sm text-amber-800 dark:text-amber-200">
                                • {warning}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Physical Practices */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Activity className="h-5 w-5 text-green-500" />
            Physical Wellness Practices
          </h3>
          {recommendations.physical.map((practice, index) => (
            <motion.div
              key={`physical-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-lg border bg-card"
            >
              <div 
                className="p-4 cursor-pointer"
                onClick={() => setExpandedItem(expandedItem === `physical-${index}` ? null : `physical-${index}`)}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{practice.title}</h4>
                  <ChevronDown 
                    className={`h-5 w-5 transition-transform duration-200 ${
                      expandedItem === `physical-${index}` ? 'rotate-180' : ''
                    }`} 
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{practice.description}</p>
              </div>

              <AnimatePresence>
                {expandedItem === `physical-${index}` && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Info className="h-4 w-4 text-blue-500" />
                          Benefits
                        </h5>
                        <ul className="grid gap-2">
                          {practice.benefits.map((benefit, i) => (
                            <li key={i} className="text-sm flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium mb-2">Instructions</h5>
                        <ol className="space-y-2">
                          {practice.instructions.map((instruction, i) => (
                            <li key={i} className="text-sm">
                              {i + 1}. {instruction}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {practice.contraindications.length > 0 && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                          <h5 className="text-sm font-medium mb-2 flex items-center gap-2 text-amber-900 dark:text-amber-100">
                            <AlertTriangle className="h-4 w-4" />
                            Precautions
                          </h5>
                          <ul className="space-y-1">
                            {practice.contraindications.map((warning, i) => (
                              <li key={i} className="text-sm text-amber-800 dark:text-amber-200">
                                • {warning}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={generateRecommendations}
          variant="outline"
          className="w-full border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/20"
          disabled={generating}
        >
          Refresh Recommendations
        </Button>
      </CardFooter>
    </Card>
  );
}