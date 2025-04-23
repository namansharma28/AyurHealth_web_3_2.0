import { SignUp } from "@clerk/nextjs";
import { Leaf } from "lucide-react";
import Link from "next/link";
 
export default function Page() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-teal-100 dark:from-green-950 dark:to-teal-900">
      <Link href="/" className="flex items-center gap-2 mb-6">
        <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />
        <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-500 dark:from-green-400 dark:to-teal-300 text-transparent bg-clip-text">AyurHealth.AI</span>
      </Link>
      <div className="bg-white/90 dark:bg-gray-800/90 p-8 rounded-xl shadow-xl backdrop-blur-sm">
        <SignUp />
      </div>
    </div>
  );
}