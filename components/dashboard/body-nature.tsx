"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Leaf, AlertCircle, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useChatStore } from "@/lib/store";

const DOSHA_DESCRIPTIONS = {
  Vata: {
    title: "Vata Dosha",
    description: "Creative, quick-thinking, and adaptable. You thrive on change and movement.",
    characteristics: ["Light and energetic", "Creative mind", "Quick to learn", "Irregular patterns"],
    color: "from-purple-500 to-blue-500"
  },
  Pitta: {
    title: "Pitta Dosha",
    description: "Focused, ambitious, and determined. You have a natural leadership quality.",
    characteristics: ["Sharp intellect", "Good digestion", "Strong metabolism", "Natural leaders"],
    color: "from-red-500 to-orange-500"
  },
  Kapha: {
    title: "Kapha Dosha",
    description: "Calm, grounded, and nurturing. You bring stability and support to others.",
    characteristics: ["Strong stamina", "Calm nature", "Good memory", "Steady energy"],
    color: "from-green-500 to-teal-500"
  },
  "Vata-Pitta": {
    title: "Vata-Pitta Type",
    description: "Combines creativity with determination. Dynamic and multi-talented.",
    characteristics: ["Adaptable", "Quick-minded", "Passionate", "Innovative"],
    color: "from-purple-500 to-orange-500"
  },
  "Pitta-Kapha": {
    title: "Pitta-Kapha Type",
    description: "Balances ambition with stability. Strong and determined yet nurturing.",
    characteristics: ["Steady strength", "Natural leader", "Reliable", "Warm-hearted"],
    color: "from-orange-500 to-green-500"
  },
  "Vata-Kapha": {
    title: "Vata-Kapha Type",
    description: "Blends creativity with calmness. Adaptable yet grounding presence.",
    characteristics: ["Creative stability", "Flexible routine", "Supportive", "Thoughtful"],
    color: "from-purple-500 to-green-500"
  }
};

export function BodyNature() {
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [bodyNature, setBodyNature] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { chats } = useChatStore();
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
        setBodyNature(data.bodyNature || null);
        console.log('User Profile:', data.bodyNature);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeBodyNature = async () => {
    if (!userProfile?.profile) {
      toast.error('Please complete your profile first');
      router.push('/settings');
      return;
    }

    try {
      setAnalyzing(true);
      const response = await fetch('/api/body-nature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: userProfile.profile.age,
          gender: userProfile.profile.gender,
          weight: userProfile.profile.weight,
          height: userProfile.profile.height,
          foodPreference: userProfile.profile.foodPreference,
          messages: chats.flatMap(chat => chat.messages)
        }),
      });

      if (!response.ok) throw new Error('Failed to analyze body nature');
      
      const data = await response.json();
      setBodyNature(data.bodyNature);
      toast.success('Body nature analysis completed');
    } catch (error) {
      console.error('Error analyzing body nature:', error);
      toast.error('Failed to analyze body nature');
    } finally {
      setAnalyzing(false);
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

  if (!userProfile?.profile) {
    return (
      <Card className="overflow-hidden border-green-200 dark:border-green-900">
        <CardHeader className="bg-gradient-to-r from-green-500/10 to-teal-500/10 dark:from-green-500/20 dark:to-teal-500/20">
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span>Your Body Nature</span>
          </CardTitle>
          <CardDescription>Complete your profile to discover your Ayurvedic body type</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-900 dark:text-amber-100">
              <p>Please complete your profile to analyze your body nature (dosha).</p>
              <p className="text-sm text-amber-800 dark:text-amber-200 mt-2">
                We need information about your physical characteristics and lifestyle to determine your Ayurvedic constitution.
              </p>
            </div>
            <Link href="/settings">
              <Button className="gap-2">
                Complete Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!bodyNature) {
    return (
      <Card className="overflow-hidden border-green-200 dark:border-green-900">
        <CardHeader className="bg-gradient-to-r from-green-500/10 to-teal-500/10 dark:from-green-500/20 dark:to-teal-500/20">
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span>Your Body Nature</span>
          </CardTitle>
          <CardDescription>Discover your unique Ayurvedic constitution</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Button
            onClick={analyzeBodyNature}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
            disabled={analyzing}
          >
            {analyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing your body nature...
              </>
            ) : (
              'Analyze My Body Nature'
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  console.log('Dosha Info:', bodyNature);
  const doshaInfo = DOSHA_DESCRIPTIONS[bodyNature as keyof typeof DOSHA_DESCRIPTIONS];

  if (!doshaInfo) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Unable to Analyze</h2>
        <p className="text-gray-600">
          We couldn't determine your body nature. Please try again or provide more information.
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-green-200 dark:border-green-900">
      <CardHeader className="bg-gradient-to-r from-green-500/10 to-teal-500/10 dark:from-green-500/20 dark:to-teal-500/20">
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
          <span>Your Body Nature</span>
        </CardTitle>
        <CardDescription>Understanding your Ayurvedic constitution</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className={`inline-block p-8 rounded-full bg-gradient-to-br ${doshaInfo.color} bg-opacity-10 mb-4`}>
            <Leaf className="h-12 w-12 text-white" />
          </div>
          <h3 className={`text-2xl font-bold bg-gradient-to-r ${doshaInfo.color} bg-clip-text text-transparent`}>
            {doshaInfo.title}
          </h3>
          <p className="text-muted-foreground mt-2">{doshaInfo.description}</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {doshaInfo.characteristics.map((trait, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
            >
              <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${doshaInfo.color}`} />
              <span className="text-sm">{trait}</span>
            </motion.div>
          ))}
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Remember</p>
              <p className="text-muted-foreground">
                Your body nature can fluctuate based on lifestyle, diet, and seasonal changes. Regular check-ins help maintain balance.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={analyzeBodyNature}
          variant="outline"
          className="w-full border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/20"
          disabled={analyzing}
        >
          Refresh Analysis
        </Button>
      </CardContent>
    </Card>
  );
}
