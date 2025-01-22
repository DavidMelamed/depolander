import { Card, CardContent } from "@/components/ui/card";
import { TRUST_BADGES, REVIEWS } from "@/lib/constants";
import { Star } from "lucide-react";
import * as Icons from "lucide-react";

export default function TrustIndicators() {
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-8 text-center md:text-left">Why Choose Us</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {TRUST_BADGES.map((badge, index) => {
                const Icon = Icons[badge.icon as keyof typeof Icons];
                return (
                  <Card key={index}>
                    <CardContent className="p-4 flex items-center gap-3">
                      {Icon && <Icon className="h-5 w-5 text-primary" />}
                      <p className="font-medium">{badge.title}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-8 text-center md:text-left">Client Reviews</h2>
            <div className="space-y-4">
              {REVIEWS.map((review, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex gap-1 mb-2">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="mb-2 italic">"{review.text}"</p>
                    <p className="text-sm text-muted-foreground">{review.name}</p>
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
