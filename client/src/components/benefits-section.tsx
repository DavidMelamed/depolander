import { Card, CardContent } from "@/components/ui/card";
import { CAMPAIGN_INFO } from "@/lib/constants";
import { Check } from "lucide-react";

export default function BenefitsSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl font-bold mb-6">Do You Qualify?</h2>
            <div className="space-y-4">
              {CAMPAIGN_INFO.qualifications.map((qualification, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-lg">{qualification}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Reported Symptoms</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CAMPAIGN_INFO.symptoms.map((symptom, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <p className="text-lg font-medium">{symptom}</p>
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
