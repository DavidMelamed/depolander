import { Button } from "@/components/ui/button";
import { CAMPAIGN_INFO } from "@/lib/constants";
import { Phone, Clock } from "lucide-react";

export default function CallBanner() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground py-4 shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <p className="font-medium">Time-Sensitive: Claim Your Rights Now</p>
          </div>
          <Button
            size="lg"
            className="bg-destructive hover:bg-destructive/90 text-white w-full sm:w-auto hover:animate-gentle-shake"
            onClick={() => window.location.href = `tel:${CAMPAIGN_INFO.phone}`}
          >
            <Phone className="mr-2 h-5 w-5" />
            Call Now: {CAMPAIGN_INFO.phone}
          </Button>
        </div>
      </div>
    </div>
  );
}