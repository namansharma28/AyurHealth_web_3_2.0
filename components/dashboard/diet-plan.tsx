"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Settings, Clock, Apple, Leaf, Scroll, ChevronDown, UtensilsCrossed, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

interface UserProfile {
  weight?: number;
  height?: number;
  age?: number;
  gender?: string;
  foodPreference?: string;
}

interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
}

interface Meal {
  time: string;
  items: string[];
  herbs: string[];
  recipe: Recipe;
}

interface DailyPlan {
  day: string;
  meals: Meal[];
  remedies: string[];
}

interface DietPlan {
  _id: string;
  weekStartDate: string;
  dailyPlans: DailyPlan[];
}

export function DietPlan() {
  const [userProfile, setProfile] = useState<UserProfile | null>(null);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
    fetchDietPlan();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/');
      if (response.ok) {
        const data = await response.json();
        const profile = data.profile || null;
        setProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchDietPlan = async () => {
    try {
      const response = await fetch('/api/diet-plan');
      if (response.ok) {
        const data = await response.json();
        setDietPlan(data);
      }
    } catch (error) {
      console.error('Error fetching diet plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDietPlan = async () => {
    if (!userProfile) {
      toast.error('Please complete your profile in settings first');
      router.push('/settings');
      return;
    }

    try {
      setGenerating(true);
      const response = await fetch('/api/diet-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const data = await response.json();
        setDietPlan(data);
        toast.success('Diet plan generated successfully');
      }
    } catch (error) {
      console.error('Error generating diet plan:', error);
      toast.error('Failed to generate diet plan');
    } finally {
      setGenerating(false);
    }
  };

  const getTodaysPlan = () => {
    if (!dietPlan) return null;
    const today = format(new Date(), 'EEEE').toLowerCase();
    return dietPlan.dailyPlans.find(plan => plan.day.toLowerCase() === today);
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

  if (!userProfile) {
    return (
      <Card className="overflow-hidden border-green-200 dark:border-green-900">
        <CardHeader className="bg-gradient-to-r from-green-500/10 to-teal-500/10 dark:from-green-500/20 dark:to-teal-500/20">
          <CardTitle className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span>Today's Diet Plan</span>
          </CardTitle>
          <CardDescription>Complete your profile to get started</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-900 dark:text-amber-100">
              <p>Please complete your profile in settings before generating a diet plan.</p>
              <p className="text-sm text-amber-800 dark:text-amber-200 mt-2">
                We need information about your weight, height, age, and food preferences to create a personalized plan.
              </p>
            </div>
            <Link href="/settings">
              <Button className="gap-2">
                <Settings className="h-4 w-4" />
                Go to Settings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!dietPlan) {
    return (
      <Card className="overflow-hidden border-green-200 dark:border-green-900">
        <CardHeader className="bg-gradient-to-r from-green-500/10 to-teal-500/10 dark:from-green-500/20 dark:to-teal-500/20">
          <CardTitle className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span>Today's Diet Plan</span>
          </CardTitle>
          <CardDescription>Generate your personalized Ayurvedic meal plan</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Button
            onClick={generateDietPlan}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
            disabled={generating}
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating your diet plan...
              </>
            ) : (
              'Generate Diet Plan'
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const todaysPlan = getTodaysPlan();
  if (!todaysPlan) {
    return (
      <Card className="overflow-hidden border-green-200 dark:border-green-900">
        <CardHeader className="bg-gradient-to-r from-green-500/10 to-teal-500/10 dark:from-green-500/20 dark:to-teal-500/20">
          <CardTitle className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span>Today's Diet Plan</span>
          </CardTitle>
          <CardDescription>No plan found for today</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Button
            onClick={generateDietPlan}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
          >
            Generate New Plan
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-green-200 dark:border-green-900">
      <CardHeader className="bg-gradient-to-r from-green-500/10 to-teal-500/10 dark:from-green-500/20 dark:to-teal-500/20">
        <CardTitle className="flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5 text-green-600 dark:text-green-400" />
          <span>Today's Diet Plan</span>
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {format(new Date(), 'EEEE, MMMM d')}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-4">
        <div className="space-y-6">
          {todaysPlan.meals.map((meal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-lg border bg-card"
            >
              <div 
                className="p-4 cursor-pointer"
                onClick={() => setExpandedMeal(expandedMeal === `${index}` ? null : `${index}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <h3 className="font-medium">{meal.time}</h3>
                  </div>
                  <ChevronDown 
                    className={`h-5 w-5 transition-transform duration-200 ${
                      expandedMeal === `${index}` ? 'rotate-180' : ''
                    }`} 
                  />
                </div>
              </div>

              <AnimatePresence>
                {expandedMeal === `${index}` && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Apple className="h-4 w-4" />
                          Meal Items
                        </div>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {meal.items.map((item, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Leaf className="h-4 w-4" />
                          Recommended Herbs
                        </div>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {meal.herbs.map((herb, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                              {herb}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {meal.recipe && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Scroll className="h-4 w-4" />
                            Recipe: {meal.recipe.name}
                          </div>
                          <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                            <div>
                              <h5 className="text-sm font-medium mb-2">Ingredients:</h5>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {meal.recipe.ingredients.map((ingredient, i) => (
                                  <li key={i} className="flex items-center gap-2 text-sm">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                    {ingredient}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium mb-2">Instructions:</h5>
                              <ol className="space-y-2">
                                {meal.recipe.instructions.map((instruction, i) => (
                                  <li key={i} className="text-sm">
                                    {i + 1}. {instruction}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"
          >
            <h3 className="font-medium flex items-center gap-2 mb-3">
              <Leaf className="h-4 w-4 text-green-600 dark:text-green-400" />
              Daily Ayurvedic Remedies
            </h3>
            <ul className="grid gap-2">
              {todaysPlan.remedies.map((remedy, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  {remedy}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={generateDietPlan}
          variant="outline"
          className="w-full border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/20"
          disabled={generating}
        >
          Generate New Plan
        </Button>
      </CardFooter>
    </Card>
  );
}