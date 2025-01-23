import HeroSection from "@/components/hero-section";
import BenefitsSection from "@/components/benefits-section";
import EvidenceSection from "@/components/evidence-section";
import SettlementSection from "@/components/settlement-section";
import ContentAccordion from "@/components/content-accordion";
import CallBanner from "@/components/call-banner";
import { CAMPAIGN_INFO, DISCLAIMER } from "@/lib/constants";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed w-full top-0 bg-primary text-primary-foreground z-50 shadow-sm">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center min-h-[3.5rem]">
          <h1 className="text-base sm:text-lg font-semibold py-2 sm:py-0">Legal Alert: Depo-Provera Claims</h1>
          <a 
            href={`tel:${CAMPAIGN_INFO.phone}`} 
            className="text-base sm:text-lg font-bold hover:underline pb-2 sm:pb-0"
          >
            {CAMPAIGN_INFO.phone}
          </a>
        </div>
      </header>

      <main className="pt-[4.5rem] sm:pt-14">
        <HeroSection />
        <BenefitsSection />
        <EvidenceSection />
        <SettlementSection />
        <ContentAccordion />
      </main>

      <footer className="bg-muted py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-xs sm:text-sm text-muted-foreground space-y-4">
              <p className="font-medium">Important Legal Information:</p>
              <p>{DISCLAIMER}</p>
              <p>
                The information provided on this website is not intended to be medical advice. 
                Consult with qualified healthcare providers regarding medical decisions. 
                Past results do not guarantee future outcomes.
              </p>
            </div>
          </div>
        </div>
      </footer>

      <CallBanner />
    </div>
  );
}