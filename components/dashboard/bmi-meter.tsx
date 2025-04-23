"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface BMIData {
  value: number;
  category: string;
}

export function BMIMeter() {
  const [bmiData, setBmiData] = useState<BMIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateBMI();
  }, []);

  const calculateBMI = async () => {
    try {
      const response = await fetch('/api/user');
      if (!response.ok) throw new Error('Failed to fetch user data');
      
      const userData = await response.json();
      if (!userData.profile?.weight || !userData.profile?.height) {
        setLoading(false);
        return;
      }

      const weight = userData.profile.weight;
      const heightInMeters = userData.profile.height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      const category = getBMICategory(bmi);

      // Update BMI in user profile
      await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bmi: {
            value: bmi,
            category,
            lastCalculated: new Date()
          }
        }),
      });

      setBmiData({ value: bmi, category });
    } catch (error) {
      console.error('Error calculating BMI:', error);
      toast.error('Failed to calculate BMI');
    } finally {
      setLoading(false);
    }
  };

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const getBMIColor = (category: string): string => {
    switch (category) {
      case 'Underweight': return 'from-blue-500 to-blue-600';
      case 'Normal weight': return 'from-green-500 to-green-600';
      case 'Overweight': return 'from-orange-500 to-orange-600';
      case 'Obese': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getMeterPosition = (bmi: number): number => {
    // Convert BMI to a percentage for the meter (0-40 BMI range)
    return Math.min(Math.max((bmi / 40) * 100, 0), 100);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="h-[150px] flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Scale className="h-8 w-8 text-muted-foreground" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!bmiData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-muted-foreground" />
            BMI Calculator
          </CardTitle>
          <CardDescription>Update your profile to see your BMI</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 rounded-lg p-4">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">Please add your height and weight in the settings to calculate your BMI.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-muted-foreground" />
          Your BMI
        </CardTitle>
        <CardDescription>Body Mass Index Measurement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative h-4 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 w-3 h-4 bg-white border-2 border-gray-200 rounded-full shadow-lg"
            style={{ left: `${getMeterPosition(bmiData.value)}%` }}
            initial={{ x: -10 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>15</span>
          <span>25</span>
          <span>30</span>
          <span>40</span>
        </div>

        <div className="text-center space-y-2 pt-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold bg-gradient-to-r text-transparent bg-clip-text"
            style={{ backgroundImage: `linear-gradient(to right, var(--${getBMIColor(bmiData.category)}))` }}
          >
            {bmiData.value.toFixed(1)}
          </motion.div>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-sm font-medium bg-gradient-to-r ${getBMIColor(bmiData.category)} text-transparent bg-clip-text`}
          >
            {bmiData.category}
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium">Healthy BMI</div>
            <div className="text-muted-foreground text-sm">18.5 - 24.9</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium">Your BMI</div>
            <div className="text-muted-foreground text-sm">{bmiData.value.toFixed(1)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}