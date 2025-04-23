"use client";

import { UserButton } from "@clerk/nextjs";
import { Leaf, Menu } from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ModeToggle } from "@/components/dashboard/mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { SubscriptionPopup } from "@/components/subscription/subscription-popup";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isUnpaid, setIsUnpaid] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/user');
        if (!response.ok) throw new Error('Failed to fetch user');
        
        const user = await response.json();
        
        if (user.subscriptionStatus === 'unpaid') {
          setIsUnpaid(true);
          if (pathname !== '/subscription') {
            setShowPopup(true);
          }
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-900 dark:to-gray-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 dark:text-green-400" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Mobile Header */}
      <header className="md:hidden h-16 border-b flex items-center px-4 bg-card/50 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 pt-10 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center gap-2 ml-3">
          <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
          <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-teal-500 dark:from-green-400 dark:to-teal-300 text-transparent bg-clip-text">
            AyurHealth.AI
          </span>
        </div>
      </header>

      {/* Sidebar - Hidden on mobile */}
      <aside className="hidden md:block w-64 fixed top-0 left-0 h-screen border-r bg-card">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        <div className={`${isUnpaid && pathname !== '/subscription' ? 'filter blur-sm pointer-events-none' : ''}`}>
          {children}
        </div>
      </main>

      <SubscriptionPopup 
        open={showPopup} 
        onOpenChange={setShowPopup}
      />
    </div>
  );
}