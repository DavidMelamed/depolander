import { Button } from "@/components/ui/button";
import { CAMPAIGN_INFO } from "@/lib/constants";
import { Phone, AlertCircle } from "lucide-react";
import EligibilitySurvey from "./eligibility-survey";

export default function HeroSection() {
  return (
    <section className="relative bg-primary text-primary-foreground py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-destructive/90 text-white px-4 py-2 rounded-full mb-6">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{CAMPAIGN_INFO.mainHeadline}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            {CAMPAIGN_INFO.title}
          </h1>

          <p className="text-xl md:text-2xl mb-6 font-medium">
            {CAMPAIGN_INFO.subHeadline}
          </p>

          <p className="text-lg md:text-xl mb-8">
            {CAMPAIGN_INFO.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              size="lg"
              className="bg-destructive hover:bg-destructive/90 text-white w-full sm:w-auto"
              onClick={() => window.location.href = `tel:${CAMPAIGN_INFO.phone}`}
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Now: {CAMPAIGN_INFO.phone}
            </Button>

            <EligibilitySurvey />
          </div>

          <p className="text-sm md:text-base opacity-90">
            {CAMPAIGN_INFO.timeline}
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}