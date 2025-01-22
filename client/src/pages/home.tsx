import HeroSection from "@/components/hero-section";
import BenefitsSection from "@/components/benefits-section";
import TrustIndicators from "@/components/trust-indicators";
import LeadForm from "@/components/lead-form";
import { CAMPAIGN_INFO } from "@/lib/constants";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed w-full top-0 bg-primary text-primary-foreground py-2 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Legal Alert</h1>
          <a href={`tel:${CAMPAIGN_INFO.phone}`} className="text-lg font-bold hover:underline">
            {CAMPAIGN_INFO.phone}
          </a>
        </div>
      </header>

      <main className="pt-16">
        <HeroSection />
        <BenefitsSection />
        <TrustIndicators />
        <LeadForm />
      </main>

      <footer className="bg-muted py-4 mt-8 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>
            This is an advertisement for legal services. This website is not a lawyer referral service or prepaid legal services plan.
            This website is not associated with Pfizer or any government agency.
          </p>
        </div>
      </footer>
    </div>
  );
}
