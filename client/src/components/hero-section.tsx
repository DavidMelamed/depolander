import { Button } from "@/components/ui/button";
import { CAMPAIGN_INFO } from "@/lib/constants";
import { Phone } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-primary text-primary-foreground py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            {CAMPAIGN_INFO.title}
          </h1>
          
          <p className="text-lg md:text-xl mb-8">
            {CAMPAIGN_INFO.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-destructive hover:bg-destructive/90 text-white"
              onClick={() => window.location.href = `tel:${CAMPAIGN_INFO.phone}`}
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Now: {CAMPAIGN_INFO.phone}
            </Button>
            
            <Button
              size="lg"
              variant="secondary"
              onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Free Case Review
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
