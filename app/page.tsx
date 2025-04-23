import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserButton, auth } from '@clerk/nextjs';
import { Leaf, Shield, Heart, User, ArrowRight } from 'lucide-react';

export default function Home() {
  const { userId } = auth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-green-950 dark:to-teal-900">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-500 dark:from-green-400 dark:to-teal-300 text-transparent bg-clip-text">AyurHealth.AI</span>
        </div>
        <div className="flex items-center gap-4">
          <UserButton afterSignOutUrl="/" />
          {!userId ? (
            <>
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-0">
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-0">
                Go to Dashboard
              </Button>
            </Link>
          )}
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-700 to-teal-600 dark:from-green-400 dark:to-teal-300 text-transparent bg-clip-text leading-tight">
              Ancient Wisdom, <br />Modern Wellness
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-xl">
              Discover personalized Ayurvedic wellness advice powered by AI. Transform your health journey with ancient practices tailored to your modern lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {!userId ? (
                <>
                  <Link href="/sign-up">
                    <Button size="lg" className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-0">
                      Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button size="lg" variant="outline" className="border-teal-500 text-teal-700 dark:text-teal-300 dark:border-teal-700">
                      Sign In
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/dashboard">
                  <Button size="lg" className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-0">
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="rounded-2xl overflow-hidden shadow-xl w-full max-w-lg mx-auto">
              <img 
                src="/images/herbs2.png" 
                alt="Ayurvedic wellness" 
                className="w-full h-auto object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg transform transition-all duration-300 hover:scale-105">
            <div className="p-4 rounded-full bg-green-100 dark:bg-green-900 w-fit mb-4">
              <Heart className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Personalized Wellness</h3>
            <p className="text-gray-600 dark:text-gray-400">Receive customized Ayurvedic advice based on your unique constitution, symptoms, and health goals.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg transform transition-all duration-300 hover:scale-105">
            <div className="p-4 rounded-full bg-teal-100 dark:bg-teal-900 w-fit mb-4">
              <Shield className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Holistic Approach</h3>
            <p className="text-gray-600 dark:text-gray-400">Address the root causes of health concerns with comprehensive dietary, lifestyle, and herbal recommendations.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg transform transition-all duration-300 hover:scale-105">
            <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900 w-fit mb-4">
              <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Daily Tracking</h3>
            <p className="text-gray-600 dark:text-gray-400">Monitor your progress and receive ongoing support to help maintain balance and achieve optimal well-being.</p>
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto px-4 py-8 mt-12 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-teal-500 dark:from-green-400 dark:to-teal-300 text-transparent bg-clip-text">AyurHealth.AI</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} AyurHealth.AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}