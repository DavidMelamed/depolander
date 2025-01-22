import { Card, CardContent } from "@/components/ui/card";
import { CAMPAIGN_INFO, MEDICAL_EVIDENCE } from "@/lib/constants";
import { FileText, TrendingUp, AlertTriangle } from "lucide-react";

export default function EvidenceSection() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Scientific Evidence & Legal Impact
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {CAMPAIGN_INFO.legalStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">Medical Study Findings</h3>
            </div>

            <div className="space-y-4">
              {MEDICAL_EVIDENCE.keyFindings.map((finding, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-base">{finding}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4" />
                <p>
                  Source: "{MEDICAL_EVIDENCE.studyTitle}" ({MEDICAL_EVIDENCE.studyDate})
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
