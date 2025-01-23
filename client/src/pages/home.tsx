import HeroSection from "@/components/hero-section";
import BenefitsSection from "@/components/benefits-section";
import EvidenceSection from "@/components/evidence-section";
import SettlementSection from "@/components/settlement-section";
import CallBanner from "@/components/call-banner";
import { CAMPAIGN_INFO, DISCLAIMER } from "@/lib/constants";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed w-full top-0 bg-primary text-primary-foreground z-50 shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center h-14">
          <h1 className="text-lg font-semibold">Legal Alert: Depo-Provera Claims</h1>
          <a href={`tel:${CAMPAIGN_INFO.phone}`} className="text-lg font-bold hover:underline">
            {CAMPAIGN_INFO.phone}
          </a>
        </div>
      </header>

      <main className="pt-14">
        <HeroSection />
        <BenefitsSection />
        <EvidenceSection />
        <SettlementSection />
      </main>

      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-sm text-muted-foreground space-y-4">
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