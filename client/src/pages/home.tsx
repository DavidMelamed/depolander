import HeroSection from "@/components/hero-section";
import BenefitsSection from "@/components/benefits-section";
import EvidenceSection from "@/components/evidence-section";
import SettlementSection from "@/components/settlement-section";
import ContentAccordion from "@/components/content-accordion";
import CallBanner from "@/components/call-banner";
import { CAMPAIGN_INFO, DISCLAIMER } from "@/lib/constants";
import { ShieldCheck } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed w-full top-0 bg-primary text-primary-foreground z-50 shadow-sm">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center min-h-[3.5rem]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-destructive/90" />
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-0 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-destructive/90">Legal Alert</span>
              <h1 className="text-base sm:text-lg font-bold">Depo-Provera Claims Center</h1>
            </div>
          </div>
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
              <div className="pt-4 flex items-center justify-center">
                <Link href="/privacy">
                  <a className="text-primary hover:underline">Privacy Policy</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <CallBanner />
    </div>
  );
}