
"use client";

import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PenSquare, CheckCircle2 } from "lucide-react";

const NdaSchema = z.object({
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters." }),
  agree: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
});

type NdaFormValues = z.infer<typeof NdaSchema>;

const ndaContentTemplate = `
Non-Disclosure Agreement (NDA)

This Non-Disclosure Agreement is entered into as of {DATE} by and between Uwezo Inc. ("Disclosing Party") and the undersigned individual ("Receiving Party").

1. Confidential Information
The Receiving Party agrees to hold in strict confidence any proprietary or confidential information received from the Disclosing Party. This includes, but is not limited to, trade secrets, business plans, and customer information.

2. Non-Use and Non-Disclosure
The Receiving Party shall not use the Confidential Information for any purpose except to evaluate and engage in discussions concerning a potential business relationship between the parties.

3. Term
The confidentiality obligations of this Agreement shall remain in effect for a period of five (5) years from the date hereof.

By signing below, the Receiving Party acknowledges and agrees to the terms of this Agreement.
`;

export function NdaViewer({ onSigned }: { onSigned: () => void }) {
  const [isSigned, setIsSigned] = useState(false);
  const [signature, setSignature] = useState({ name: "", date: "" });
  const [date, setDate] = useState<string | null>(null);

  useEffect(() => {
    // This runs only on the client, after hydration
    setDate(new Date().toLocaleDateString());
  }, []);

  const form = useForm<NdaFormValues>({
    resolver: zodResolver(NdaSchema),
    defaultValues: {
      fullName: "",
      agree: false,
    },
  });

  const onSubmit: SubmitHandler<NdaFormValues> = (data) => {
    setSignature({
      name: data.fullName,
      date: new Date().toLocaleString(),
    });
    setIsSigned(true);
    onSigned();
  };
  
  const getRenderedNdaContent = () => {
    if (!date) return "Loading...";
    return ndaContentTemplate.replace(/{DATE}/g, date);
  };

  if (isSigned) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            NDA Signed
          </CardTitle>
          <CardDescription>
            Thank you. The Non-Disclosure Agreement was signed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="border rounded-lg p-4 bg-muted/50">
                <p className="font-semibold">{signature.name}</p>
                <p className="text-sm text-muted-foreground">Signed on {signature.date}</p>
            </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Non-Disclosure Agreement (NDA)</CardTitle>
        <CardDescription>
          Please read the agreement carefully and sign below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ScrollArea className="h-64 w-full rounded-md border p-4">
              <pre className="whitespace-pre-wrap text-sm font-sans">{getRenderedNdaContent()}</pre>
            </ScrollArea>
            
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="fullNameNda">Full Name</FormLabel>
                  <FormControl>
                    <Input id="fullNameNda" placeholder="Enter your full legal name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="agree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I have read, understood, and agree to the terms of this NDA.
                    </FormLabel>
                     <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={!form.formState.isValid}>
              <PenSquare className="mr-2 h-4 w-4" />
              Sign NDA
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
