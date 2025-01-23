import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  phone: z.string().min(10, "Valid phone number required").regex(/^[0-9()-\s]+$/, "Invalid phone number format"),
  email: z.string().email("Valid email required"),
  details: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

const parseErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred. Please try again.';
};

export default function LeadForm() {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      details: ""
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      try {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || `Error: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();
        if (!responseData || typeof responseData !== 'object') {
          throw new Error('Invalid response from server');
        }

        return responseData;
      } catch (error) {
        throw new Error(parseErrorMessage(error));
      }
    },
    onSuccess: () => {
      toast({
        title: "Form submitted successfully",
        description: "We'll contact you shortly to discuss your case.",
        variant: "default"
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: parseErrorMessage(error),
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: FormData) => {
    // Normalize phone number before submission
    const normalizedData = {
      ...data,
      phone: data.phone.replace(/[^\d]/g, '')
    };
    mutation.mutate(normalizedData);
  };

  return (
    <section id="lead-form" className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-xl">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Get Your Free Case Review
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John" 
                        {...field} 
                        aria-label="First Name"
                        disabled={mutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Doe" 
                        {...field} 
                        aria-label="Last Name"
                        disabled={mutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder="(555) 555-5555" 
                      {...field} 
                      aria-label="Phone Number"
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="john@example.com" 
                      {...field} 
                      aria-label="Email"
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Details (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please share any relevant details about your case"
                      {...field}
                      aria-label="Case Details"
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={mutation.isPending}
              aria-label={mutation.isPending ? "Submitting form..." : "Submit Case Review"}
            >
              {mutation.isPending ? "Submitting..." : "Submit Case Review"}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}