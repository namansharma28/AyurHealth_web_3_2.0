import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

export function UserAvatar() {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src="" />
      <AvatarFallback className="bg-primary-foreground">
        <User className="h-4 w-4 text-muted-foreground" />
      </AvatarFallback>
    </Avatar>
  );
}