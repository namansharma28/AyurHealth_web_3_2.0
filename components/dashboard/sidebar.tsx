"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, LineChart, Home, Settings, Leaf, FileText } from "lucide-react";
import { ModeToggle } from "@/components/dashboard/mode-toggle";
import { UserButton } from "@clerk/nextjs";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      label: "AI Companion",
      href: "/chat",
      icon: MessageSquare,
    },
    {
      label: "Tracker",
      href: "/tracker",
      icon: LineChart,
    },
    {
      label: "Health Report",
      href: "/report",
      icon: FileText,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Logo Section */}
      <div className="p-6 border-b border-border/50">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
          <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-teal-500 dark:from-green-400 dark:to-teal-300 text-transparent bg-clip-text">
            AyurHealth.AI
          </span>
        </Link>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-3 py-6">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/chat" && pathname.startsWith("/chat/")) ||
              (item.href === "/tracker" && pathname.startsWith("/tracker/"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gradient-to-r from-green-500/10 to-teal-500/10 text-green-600 dark:text-green-400"
                    : "text-muted-foreground hover:bg-gradient-to-r hover:from-green-500/5 hover:to-teal-500/5 hover:text-green-600 dark:hover:text-green-400"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Controls Section - Fixed at Bottom */}
      <div className="border-t border-border/50 p-4 space-y-3">
        <div className="bg-gradient-to-tr from-green-400 via-emerald-500 to-lime-500 p-[2px] rounded-lg">
          <ModeToggle className="w-full justify-start text-sm font-medium text-muted-foreground bg-neutral-800 rounded-lg p-4 hover:text-green-600 dark:hover:text-green-400 hover:bg-gradient-to-r hover:from-green-500/5 hover:to-teal-500/5" />
        </div>
        <div className="bg-gradient-to-tr from-green-400 via-emerald-500 to-lime-500 p-[2px] rounded-lg">
          <div className="flex items-center gap-3 px-2 py-2 bg-neutral-800 rounded-lg text-sm text-muted-foreground">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox:
                    "p-[2px] rounded-full bg-gradient-to-tr from-green-400 via-emerald-500 to-lime-500",
                  userButtonAvatarImage: "rounded-full",
                },
              }}
            />
            <span className="font-medium hover:text-green-600 dark:hover:text-green-400 hover:bg-gradient-to-r hover:from-green-500/5 hover:to-teal-500/5">Account</span>
          </div>
        </div>
      </div>
    </div>
  );
}