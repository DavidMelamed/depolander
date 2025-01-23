import { Card, CardContent } from "@/components/ui/card";
import { CAMPAIGN_INFO, MEDICAL_EVIDENCE, REVIEWS } from "@/lib/constants";
import { FileText, TrendingUp, AlertTriangle, Star, Quote } from "lucide-react";

export default function EvidenceSection() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Reviews Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Real Stories from Depo-Provera Users
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {REVIEWS.map((review, index) => (
                <Card key={index} className="border-primary/10">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <Quote className="h-6 w-6 text-primary/40 mb-2" />
                    <p className="text-sm mb-4">{review.text}</p>
                    <p className="text-sm font-medium text-primary">{review.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-8 text-center">
            Scientific Evidence & Legal Impact
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {CAMPAIGN_INFO.legalStats.map((stat, index) => (
              <Card key={index} className="border-primary/10">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Critical Medical Study Findings</h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {MEDICAL_EVIDENCE.keyFindings.map((finding, index) => (
                  <div key={index} className="flex items-start gap-3 bg-muted/30 p-4 rounded-lg">
                    <div className="mt-1">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <p className="text-base font-medium">{finding}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <p>
                    Source: "{MEDICAL_EVIDENCE.studyTitle}" ({MEDICAL_EVIDENCE.studyDate})
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}