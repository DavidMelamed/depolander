import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

interface Template {
  id: number;
  name: string;
  structure: any;
  phoneNumber: string;
  sections: Array<{
    id: number;
    name: string;
    type: string;
    content: any;
    order: number;
    styles: any;
  }>;
}

export default function Landing() {
  const { data: template, isLoading } = useQuery<Template>({
    queryKey: ["/api/templates/1/view"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold mb-4">Welcome to Mass Tort Hub</h1>
            <p className="text-muted-foreground">Please contact us for legal consultation.</p>
            <Button className="mt-4" size="lg">
              <Phone className="mr-2 h-4 w-4" />
              Call Now
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {template.sections.map((section) => (
          <div key={section.id} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{section.name}</h2>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: section.content.html || '' }}
            />
          </div>
        ))}
        
        <Card className="sticky bottom-4 mt-8">
          <CardContent className="flex justify-between items-center p-4">
            <div>
              <h3 className="font-semibold">Get Legal Help Now</h3>
              <p className="text-sm text-muted-foreground">Free Consultation Available</p>
            </div>
            <Button size="lg">
              <Phone className="mr-2 h-4 w-4" />
              {template.phoneNumber || 'Call Now'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
