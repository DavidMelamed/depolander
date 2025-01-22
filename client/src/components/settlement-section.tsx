import { Card, CardContent } from "@/components/ui/card";
import { CAMPAIGN_INFO } from "@/lib/constants";
import { DollarSign, Clock, ListChecks, AlertTriangle, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettlementSection() {
  const { settlementInfo } = CAMPAIGN_INFO;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Settlement Information & Process
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Potential Compensation</h3>
                </div>
                <div className="space-y-2">
                  <p><strong>Average Range:</strong> {settlementInfo.averageAmount}</p>
                  <p><strong>Settlement Range:</strong> {settlementInfo.range}</p>
                  <div className="mt-4 p-3 bg-destructive/10 rounded-lg">
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-5 w-5" />
                      <p className="font-medium">Time-Sensitive: Legal Deadlines Apply</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Timeline</h3>
                </div>
                <p className="mb-4">{settlementInfo.timeline}</p>
                <Button 
                  className="w-full"
                  onClick={() => window.location.href = `tel:${CAMPAIGN_INFO.phone}`}
                >
                  <PhoneCall className="mr-2 h-5 w-5" />
                  Start Your Claim Now
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <ListChecks className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Legal Process</h3>
              </div>
              <div className="space-y-4 mb-6">
                {settlementInfo.process.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 text-primary px-2 py-1 text-sm font-medium">
                      {index + 1}
                    </div>
                    <p>{step}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <p className="font-medium">Fast & Free Case Evaluation</p>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Our experienced legal team is available 24/7 to discuss your case and potential compensation.
                </p>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                  onClick={() => window.location.href = `tel:${CAMPAIGN_INFO.phone}`}
                >
                  <PhoneCall className="mr-2 h-5 w-5" />
                  Call Now: {CAMPAIGN_INFO.phone}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}