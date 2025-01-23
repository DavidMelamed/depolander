import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { CAMPAIGN_INFO } from "@/lib/constants";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ContentAccordion() {
  const caseUpdates = [
    {
      date: "October 2024",
      content: "A study of prior meningioma cases indicates the potential for high settlement or payout amounts. The average verdict involving the rare brain tumor was over $3 million, with settlements averaging around $868,000."
    },
    {
      date: "September 2024",
      content: "Claims against the manufacturer of Depo-Provera are expected to be consolidated in federal court. The claims allege the manufacturer knew of the increased risk of meningiomas associated with prolonged use of the drug and failed to warn consumers."
    },
    {
      date: "March 2024",
      content: "A study published in the BMJ found that prolonged use of Depo-Provera may be linked to an increased risk of a rare type of non-cancerous brain tumor known as meningiomas."
    }
  ];

  const faqs = [
    {
      question: "What are the estimated settlement amounts for Depo-Provera lawsuits?",
      answer: "Settlement amounts can vary widely depending on individual case factors, such as the severity of the injury and the evidence supporting the claim. Current estimates range from $150,000 to $500,000, with potential for higher amounts based on case specifics."
    },
    {
      question: "How are Depo-Provera settlement amounts determined?",
      answer: "Settlement amounts are typically determined based on factors such as the extent of injuries, medical expenses, loss of wages, and the strength of the evidence linking Depo-Provera use to the development of meningiomas."
    },
    {
      question: "How long does it take to receive a Depo-Provera settlement?",
      answer: "The timeline for receiving a settlement can vary, potentially taking several months or even years depending on the complexity of the case and negotiations. Factors affecting the timeline include case complexity, number of plaintiffs, and the manufacturer's willingness to settle."
    },
    {
      question: "What costs are deducted from my settlement payment?",
      answer: "Common deductions from a settlement include attorney fees, court costs, expert witness fees, and any medical liens or outstanding bills related to your case."
    },
    {
      question: "How will the outcome of the Depo-Provera bellwether trials affect my settlement?",
      answer: "The results of bellwether trials can significantly influence settlement negotiations by setting precedents and establishing likely ranges for damages. Favorable outcomes in these trials often lead to higher settlement values for subsequent cases."
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Important Information About Your Case</h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Recent Case Updates</h3>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                  {caseUpdates.map((update, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <div className="font-semibold text-primary mb-2">{update.date}</div>
                      <p className="text-sm text-muted-foreground">{update.content}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Legal Process Overview</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="consultation">
                <AccordionTrigger>Initial Case Evaluation</AccordionTrigger>
                <AccordionContent>
                  Our team evaluates your case, reviewing medical records and Depo-Provera usage history to determine eligibility for compensation. This thorough evaluation is completely free and confidential.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="evidence">
                <AccordionTrigger>Evidence Collection</AccordionTrigger>
                <AccordionContent>
                  We gather all necessary documentation, including medical records, expert testimonies, and scientific studies linking Depo-Provera to meningiomas and other health issues.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="negotiation">
                <AccordionTrigger>Settlement Negotiation</AccordionTrigger>
                <AccordionContent>
                  Our experienced attorneys negotiate with the manufacturer's legal team to secure the maximum possible compensation for your injuries and suffering.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl font-bold mb-6">Frequently Asked Questions</h3>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="max-w-3xl mx-auto mt-12">
          <h3 className="text-xl font-bold mb-4">Additional Information</h3>
          <div className="prose prose-sm">
            <p className="mb-4">
              The manufacturer of Depo-Provera has come under increased scrutiny following recent studies linking the contraceptive to meningiomas (brain tumors) in women. A 2024 study published in the British Medical Journal (BMJ) found that prolonged use of progesterone medication, such as Depo-Provera, may increase a person's risk of developing these rare brain tumors.
            </p>
            <p className="mb-4">
              Based on previous cases and current evidence, our legal team estimates potential settlement amounts to range between $150,000 and $500,000, with some cases potentially exceeding these amounts depending on various factors including injury severity and provable damages.
            </p>
            <p>
              If you or a loved one has been diagnosed with a meningioma after using Depo-Provera, it's crucial to understand your legal rights and options. Contact our experienced legal team today for a free, confidential consultation to discuss your potential case.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
