"use client";

import { useEffect, useState } from 'react';
import { useUser } from "@clerk/clerk-react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Leaf, Check } from 'lucide-react';
import Link from 'next/link';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser()
  
  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!isSignedIn) {
    return <div>Sign in to view this page</div>
  }

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubscription = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/subscription', {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to create subscription');
      
      const order = await response.json();
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'AyurHealth.AI',
        description: 'Premium Subscription',
        order_id: order.id,
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch('/api/subscription', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) throw new Error('Payment verification failed');

            toast.success('Subscription activated successfully!');
            router.push('/dashboard');
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error('Failed to verify payment. Please contact support.');
          }
        },
        prefill: {
          name: '${user?.firstName} ${user?.lastName}',
          email: '${user?.email_address',
        },
        theme: {
          color: '#10B981',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to initiate subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen relative flex flex-col"
      style={{
        backgroundImage: "url('/images/herb.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      <header className="relative z-10 container mx-auto px-4 py-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <Leaf className="h-8 w-8 text-green-400" />
          <span className="text-2xl font-bold text-white">AyurHealth.AI</span>
        </Link>
      </header>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Premium Access
            </CardTitle>
            <CardDescription className="text-base">
              Transform your wellness journey with personalized Ayurvedic guidance
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="text-center mb-8">
              <p className="text-5xl font-bold text-green-600 dark:text-green-500">₹1</p>
              <p className="text-sm text-muted-foreground mt-1">One Time</p>
            </div>
            
            <div className="space-y-4">
              {[
                'Unlimited AI consultations',
                'Personalized wellness tracking',
                'Priority support',
                'Daily wellness insights',
                'Custom health recommendations'
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button 
              className="w-full h-12 text-lg bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={handleSubscription}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Start Your Journey'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}