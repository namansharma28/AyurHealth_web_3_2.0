import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SubscriptionPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubscriptionPopup({ open, onOpenChange }: SubscriptionPopupProps) {
  const router = useRouter();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Subscribe to Access</DialogTitle>
          <DialogDescription>
            Get unlimited access to personalized Ayurvedic wellness advice and features.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <p className="text-sm text-muted-foreground">
            Unlock all features including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Unlimited AI consultations</li>
            <li>Personalized wellness tracking</li>
            <li>Priority support</li>
          </ul>
          <Button 
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
            onClick={() => router.push('/subscription')}
          >
            View Subscription Plans
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}