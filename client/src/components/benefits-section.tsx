import { Card, CardContent } from "@/components/ui/card";
import { CAMPAIGN_INFO } from "@/lib/constants";
import { Check, AlertTriangle } from "lucide-react";

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