import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Leaf } from "lucide-react";

export function BotAvatar() {
  return (
    <Avatar className="h-8 w-8 bg-green-100 dark:bg-green-900">
      <AvatarFallback className="text-green-700 dark:text-green-300">
        <Leaf className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );
}