import { Card, CardContent } from "@/components/ui/card";
import { CAMPAIGN_INFO } from "@/lib/constants";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <div className="prose prose-sm sm:prose-base max-w-none">
              <p className="mb-4">Last Updated: January 23, 2025</p>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Introduction</h2>
                <p>
                  This Privacy Policy describes how {CAMPAIGN_INFO.title} ("we," "our," or "us") 
                  collects, uses, and shares your personal information when you visit our website 
                  or submit information through our online forms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Information We Collect</h2>
                <p className="mb-4">We collect information that you provide directly to us, including:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Name and contact information</li>
                  <li>Medical history related to Depo-Provera usage</li>
                  <li>Diagnosis information</li>
                  <li>Date of first use and duration of use</li>
                  <li>Other relevant medical information</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
                <p className="mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Evaluate your potential legal claim</li>
                  <li>Contact you about your legal rights</li>
                  <li>Connect you with legal representation</li>
                  <li>Provide updates about your case</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Information Sharing</h2>
                <p>
                  We may share your information with law firms, medical experts, and other necessary 
                  parties involved in your potential legal claim. We implement appropriate safeguards 
                  to protect your information and only share what is necessary for the purpose of 
                  evaluating and pursuing your legal claim.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Your Rights</h2>
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy or our practices, 
                  please contact us at {CAMPAIGN_INFO.phone}.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
