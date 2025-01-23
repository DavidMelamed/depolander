import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";

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
    const normalizedData = {
      ...data,
      phone: data.phone.replace(/[^\d]/g, '')
    };
    mutation.mutate(normalizedData);
  };

  return (
    <section id="lead-form" className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-xl">
        <motion.h2 
          className="text-2xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Get Your Free Case Review
        </motion.h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <motion.div 
              className="grid sm:grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <motion.div
                        whileTap={{ scale: 0.995 }}
                      >
                        <Input 
                          placeholder="John" 
                          {...field} 
                          aria-label="First Name"
                          disabled={mutation.isPending}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </motion.div>
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
                      <motion.div
                        whileTap={{ scale: 0.995 }}
                      >
                        <Input 
                          placeholder="Doe" 
                          {...field} 
                          aria-label="Last Name"
                          disabled={mutation.isPending}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </motion.div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <motion.div
                        whileTap={{ scale: 0.995 }}
                      >
                        <Input 
                          type="tel" 
                          placeholder="(555) 555-5555" 
                          {...field} 
                          aria-label="Phone Number"
                          disabled={mutation.isPending}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </motion.div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <motion.div
                        whileTap={{ scale: 0.995 }}
                      >
                        <Input 
                          type="email" 
                          placeholder="john@example.com" 
                          {...field} 
                          aria-label="Email"
                          disabled={mutation.isPending}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </motion.div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case Details (Optional)</FormLabel>
                    <FormControl>
                      <motion.div
                        whileTap={{ scale: 0.995 }}
                      >
                        <Textarea
                          placeholder="Please share any relevant details about your case"
                          {...field}
                          aria-label="Case Details"
                          disabled={mutation.isPending}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </motion.div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button
                type="submit"
                className="w-full relative"
                size="lg"
                disabled={mutation.isPending}
                aria-label={mutation.isPending ? "Submitting form..." : "Submit Case Review"}
              >
                <AnimatePresence mode="wait">
                  {mutation.isPending ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </motion.span>
                  ) : mutation.isSuccess ? (
                    <motion.span
                      key="success"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Submit Case Review
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </form>
        </Form>
      </div>
    </section>
  );
}