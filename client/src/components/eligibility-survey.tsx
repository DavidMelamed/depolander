import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CAMPAIGN_INFO } from "@/lib/constants";
import { Phone, ArrowRight, Clock, Scale } from "lucide-react";

export default function EligibilitySurvey() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isEligible, setIsEligible] = useState(false);

  const handleResponse = (eligible: boolean) => {
    setIsEligible(eligible);
    setStep(2);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" variant="secondary" className="w-full sm:w-auto">
          Free Case Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            {step === 1 ? "Check Your Eligibility" : isEligible ? "You May Qualify for Compensation" : "Contact Us for More Information"}
          </DialogTitle>
        </DialogHeader>
        
        {step === 1 ? (
          <div className="space-y-6 py-4">
            <p className="text-lg font-medium text-center">
              Were you diagnosed with a Meningioma Tumor after using the birth control Depo-Provera for at least one year?
            </p>
            <div className="flex gap-4">
              <Button 
                className="flex-1" 
                variant="default"
                onClick={() => handleResponse(true)}
              >
                Yes
              </Button>
              <Button 
                className="flex-1" 
                variant="outline"
                onClick={() => handleResponse(false)}
              >
                No
              </Button>
            </div>
          </div>
        ) : isEligible ? (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Scale className="h-5 w-5" />
                <p>You may be entitled to significant compensation</p>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <Clock className="h-5 w-5" />
                <p>Time-sensitive: Call now to protect your rights</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button 
                className="w-full text-lg py-6"
                size="lg"
                onClick={() => window.location.href = `tel:${CAMPAIGN_INFO.phone}`}
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Now: {CAMPAIGN_INFO.phone}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Free consultation available 24/7/365
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <p className="text-center">
              Contact us to learn more about your legal rights regarding Depo-Provera usage.
            </p>
            <Button 
              className="w-full"
              onClick={() => window.location.href = `tel:${CAMPAIGN_INFO.phone}`}
            >
              <Phone className="mr-2 h-5 w-5" />
              Call {CAMPAIGN_INFO.phone}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
