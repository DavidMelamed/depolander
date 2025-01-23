import { Button } from "@/components/ui/button";
import { CAMPAIGN_INFO, TRUST_BADGES } from "@/lib/constants";
import { Phone, AlertCircle, Shield, Clock } from "lucide-react";
import EligibilitySurvey from "./eligibility-survey";

export default function HeroSection() {
  return (
    <section className="relative bg-primary text-primary-foreground py-12 sm:py-20">
      {/* Alert Banner */}
      <div className="absolute top-0 left-0 right-0 bg-destructive text-destructive-foreground py-2">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <AlertCircle className="h-4 w-4" />
            <span>ALERT: New Evidence Links Depo-Provera to Brain Tumors</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-destructive/90 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-xs sm:text-sm font-medium">Time-Sensitive Legal Alert</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">
            {CAMPAIGN_INFO.title}
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6 font-medium text-destructive/90">
            {CAMPAIGN_INFO.subHeadline}
          </p>

          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto">
            {CAMPAIGN_INFO.description}
          </p>

          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
            <Button
              size="lg"
              className="bg-destructive hover:bg-destructive/90 text-white w-full text-lg py-6 hover:animate-gentle-shake"
              onClick={() => window.location.href = `tel:${CAMPAIGN_INFO.phone}`}
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Now: {CAMPAIGN_INFO.phone}
            </Button>
            <EligibilitySurvey />
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {TRUST_BADGES.map((badge, index) => (
              <div key={index} className="flex items-center justify-center gap-2 bg-primary-foreground/10 rounded-lg p-3">
                <Shield className="h-4 w-4 text-destructive/90" />
                <span className="text-sm font-medium">{badge.title}</span>
              </div>
            ))}
          </div>

          <div className="bg-destructive/10 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 text-destructive font-medium justify-center">
              <AlertCircle className="h-5 w-5" />
              <p>{CAMPAIGN_INFO.timeline}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}