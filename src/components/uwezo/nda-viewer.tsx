
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PenSquare, CheckCircle2 } from "lucide-react";
import { contractTemplates, engagementTypes, type EngagementType } from "@/lib/contract-templates";

const ContractSchema = z.object({
  engagementType: z.string().min(1, { message: "Please select a type of engagement." }),
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters." }),
  agree: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
});

type ContractFormValues = z.infer<typeof ContractSchema>;

export function ContractViewer({ onSigned }: { onSigned: () => void }) {
  const [isSigned, setIsSigned] = useState(false);
  const [signature, setSignature] = useState({ name: "", date: "", type: "" });
  const [date, setDate] = useState<string | null>(null);

  useEffect(() => {
    // This runs only on the client, after hydration
    setDate(new Date().toLocaleDateString());
  }, []);

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(ContractSchema),
    defaultValues: {
      engagementType: "",
      fullName: "",
      agree: false,
    },
  });

  const selectedEngagementType = form.watch("engagementType") as EngagementType | "";

  const onSubmit: SubmitHandler<ContractFormValues> = (data) => {
    setSignature({
      name: data.fullName,
      date: new Date().toLocaleString(),
      type: data.engagementType,
    });
    setIsSigned(true);
    onSigned();
    // Here you would typically save the signed contract to Firestore
    // e.g., saveContract({ ...data, userId: user.uid, signedAt: serverTimestamp() });
  };
  
  const getContractContent = () => {
    if (!date) return "Loading...";
    const template = selectedEngagementType ? contractTemplates[selectedEngagementType] : "Please select a contract type to view the agreement.";
    return template.replace(/{DATE}/g, date);
  };

  if (isSigned) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            Contract Signed
          </CardTitle>
          <CardDescription>
            Thank you. The {signature.type} agreement was signed successfully.
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
        <CardTitle>Sign Your Employment Contract</CardTitle>
        <CardDescription>
          Please select your engagement type, read the agreement carefully, and sign below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="engagementType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Type of Engagement</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a contract type..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {engagementTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ScrollArea className="h-64 w-full rounded-md border p-4">
              <pre className="whitespace-pre-wrap text-sm font-sans">{getContractContent()}</pre>
            </ScrollArea>
            
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="fullName">Full Name</FormLabel>
                  <FormControl>
                    <Input id="fullName" placeholder="Enter your full legal name" {...field} disabled={!selectedEngagementType} />
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
                      disabled={!selectedEngagementType}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className={!selectedEngagementType ? "text-muted-foreground" : ""}>
                      I have read, understood, and agree to the terms of this agreement.
                    </FormLabel>
                     <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={!selectedEngagementType || !form.formState.isValid}>
              <PenSquare className="mr-2 h-4 w-4" />
              Sign Agreement
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
