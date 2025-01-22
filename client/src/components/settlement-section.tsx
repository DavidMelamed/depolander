import { Card, CardContent } from "@/components/ui/card";
import { CAMPAIGN_INFO } from "@/lib/constants";
import { DollarSign, Clock, ListChecks } from "lucide-react";

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
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Timeline</h3>
                </div>
                <p>{settlementInfo.timeline}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <ListChecks className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Legal Process</h3>
              </div>
              <div className="space-y-4">
                {settlementInfo.process.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 text-primary px-2 py-1 text-sm font-medium">
                      {index + 1}
                    </div>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
