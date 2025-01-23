import { Card, CardContent } from "@/components/ui/card";
import { CAMPAIGN_INFO } from "@/lib/constants";
import { DollarSign, Scale, Shield, Trophy, PhoneCall, FileCheck, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettlementSection() {
  const { settlementInfo } = CAMPAIGN_INFO;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Compensation & Legal Support
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Financial Recovery</h3>
                </div>
                <p className="mb-4">Potential compensation range: {settlementInfo.range}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Trophy className="h-4 w-4" />
                  <span>Proven Track Record</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Expert Legal Team</h3>
                </div>
                <p className="mb-4">Experienced attorneys specialized in mass tort litigation</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BadgeCheck className="h-4 w-4" />
                  <span>Top-Rated Lawyers</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">No Upfront Costs</h3>
                </div>
                <p className="mb-4">Pay nothing unless we win your case</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileCheck className="h-4 w-4" />
                  <span>Free Consultation</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Start Your Claim Today</h3>
                    <p className="text-muted-foreground">
                      Our experienced legal team is available 24/7 to evaluate your case and discuss your potential compensation.
                    </p>
                  </div>
                  <Button 
                    className="bg-primary hover:bg-primary/90"
                    size="lg"
                    onClick={() => window.location.href = `tel:${CAMPAIGN_INFO.phone}`}
                  >
                    <PhoneCall className="mr-2 h-5 w-5" />
                    Call Now
                  </Button>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="text-sm">Confidential Case Review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-primary" />
                    <span className="text-sm">No Win, No Fee Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span className="text-sm">Proven Results</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}