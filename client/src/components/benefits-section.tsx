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

            <div className="bg-muted p-6 rounded-lg mt-8">
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
            <h2 className="text-2xl font-bold mb-6">Potential Compensation & Symptoms</h2>
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Settlement Estimates</h3>
                <p className="text-lg mb-4">Estimated settlement amounts range from $150,000 to $500,000 per case, with some cases potentially exceeding these amounts based on various factors:</p>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>Severity of injuries</li>
                  <li>Duration of Depo-Provera use</li>
                  <li>Medical expenses incurred</li>
                  <li>Lost wages and earning capacity</li>
                  <li>Pain and suffering</li>
                </ul>
                <div className="text-sm text-muted-foreground">
                  Note: Each case is unique, and settlement amounts may vary based on individual circumstances.
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              <h3 className="text-xl font-semibold">Common Symptoms & Complications</h3>
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