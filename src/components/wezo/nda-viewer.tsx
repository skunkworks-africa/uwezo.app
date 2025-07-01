"use client";

import { useState } from "react";
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

const getTodaysDate = () => {
    if (typeof window !== 'undefined') {
        return new Date().toLocaleDateString()
    }
    return '';
}

const ndaContent = `MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT

This agreement is entered on ${getTodaysDate()} by and between:
Wezo Inc., a company duly incorporated, with its principal place of business at 123 Innovation Drive, Tech City, including its successors and assigns (the “Company”), and you, the user (the “Recipient”).

The parties possess competitively valuable Confidential Information (as hereinafter defined) regarding their past, current and future services and products, research and development, customers, business plans, software, listings, holdings, alliances, investments, transactions, intellectual property and rights associated thereto and general business operations. The parties wish to enter into a mutually beneficial relationship, and as such, wish to share their Confidential Information with the other party, including its authorized employees and agents. For the purposes of this Agreement, the party that discloses Confidential Information to the other party shall be referred to as the “Disclosing Party” and the party that receives such Confidential Information from the other party shall be referred to as the “Recipient”.

The Recipient may be given access to the Disclosing Party’s Confidential Information or to create new Confidential Information for the Disclosing Party.

In view of the above, the parties agree as follows:

1. Confidential Information
"Confidential Information" includes any information:
▪ specifically indicated by the Disclosing Party, either verbally or in writing, as confidential;
▪ under the circumstances of the disclosure, that are to be treated as confidential; or
▪ the Recipient creates or produces while performing its obligations under this Agreement, regardless of the media that contains the information.

Confidential Information does not include information, which:
▪ is generally available to the public at the time of its disclosure to the Recipient;
▪ becomes known to the public through no fault/action of the Recipient in violation of the terms herein;
▪ is legally known to the Recipient at the time of disclosure by the Disclosing Party;
▪ is furnished by the Disclosing Party to third parties without restriction;
`;

export function NdaViewer({ onSigned }: { onSigned: () => void }) {
  const [isSigned, setIsSigned] = useState(false);
  const [signature, setSignature] = useState({ name: "", date: "" });

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
  
  const [date, setDate] = useState('');
  useState(() => {
    setDate(new Date().toLocaleDateString());
  });

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
        <CardTitle>Non-Disclosure Agreement</CardTitle>
        <CardDescription>
          Please read the agreement carefully and sign below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 w-full rounded-md border p-4 mb-6">
          <pre className="whitespace-pre-wrap text-sm font-sans">{ndaContent.replace('${getTodaysDate()}', date)}</pre>
        </ScrollArea>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="fullName">Full Name</FormLabel>
                  <FormControl>
                    <Input id="fullName" placeholder="Enter your full legal name" {...field} />
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
                      I have read, understood, and agree to the terms of this Non-Disclosure Agreement.
                    </FormLabel>
                     <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit">
              <PenSquare className="mr-2 h-4 w-4" />
              Sign Agreement
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
