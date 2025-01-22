import { Card, CardContent } from "@/components/ui/card";
import { CAMPAIGN_INFO } from "@/lib/constants";
import { Check, AlertTriangle, PhoneCall, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BenefitsSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Case Qualification Criteria</h2>
            <div className="space-y-4 mb-8">
              {CAMPAIGN_INFO.qualifications.map((qualification, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-lg">{qualification}</p>
                </div>
              ))}
            </div>

            {/* Emergency Call Box */}
            <Card className="bg-destructive text-destructive-foreground">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6" />
                  <h3 className="text-xl font-semibold">Urgent Legal Alert</h3>
                </div>
                <p className="mb-4">Time is critical in mass tort cases. Don't risk losing your right to compensation.</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <p>Free 24/7 Case Evaluation</p>
                  </div>
                  <Button 
                    className="w-full bg-white text-destructive hover:bg-white/90"
                    size="lg"
                    onClick={() => window.location.href = `tel:${CAMPAIGN_INFO.phone}`}
                  >
                    <PhoneCall className="mr-2 h-5 w-5" />
                    Call {CAMPAIGN_INFO.phone}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Key Facts About the Lawsuit</h3>
              <div className="space-y-3">
                {CAMPAIGN_INFO.keyFacts.map((fact, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    </div>
                    <p className="text-base">{fact}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Common Symptoms & Complications</h2>
            <div className="grid gap-4">
              {CAMPAIGN_INFO.symptoms.map((symptom, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      <p className="text-lg font-medium">{symptom}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}