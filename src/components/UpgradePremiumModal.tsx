
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Diamond, Mic } from "lucide-react";

export interface UpgradePremiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpgradePremiumModal: React.FC<UpgradePremiumModalProps> = ({ open, onOpenChange }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md w-full p-8 rounded-2xl shadow-lg">
      <DialogHeader>
        <div className="flex items-center gap-2 mb-2">
          <Diamond
            size={28}
            style={{
              background: 'linear-gradient(90deg, #7ED321 0%, #33C3F0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          />
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-meditation-soft-green to-meditation-calm-blue bg-clip-text text-transparent">
            Unlock Premium
          </DialogTitle>
        </div>
        <DialogDescription>
          Access exclusive premium features like advanced meditation creation and enhanced audio.
        </DialogDescription>
      </DialogHeader>
      <div className="my-4 text-center">
        <p className="mb-2">Upgrade now to enjoy all premium benefits and boost your meditation journey!</p>
        <Button
          className="w-full py-3 font-bold rounded-xl bg-gradient-to-r from-meditation-soft-green to-meditation-calm-blue text-white shadow-lg border-0"
        >
          Upgrade Now
        </Button>
        {/* You can wire this button to Stripe checkout functionality. */}
      </div>
      <DialogClose asChild>
        <Button variant="ghost" className="w-full mt-2">Cancel</Button>
      </DialogClose>
    </DialogContent>
  </Dialog>
);
