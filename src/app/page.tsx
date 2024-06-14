"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { PortfolioTable } from "@/components/portfolio-table";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { securityRowSchema } from "@/lib/schemas";
import type { Ticker } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Home() {
  const tickerData: Ticker[] = [
    { value: "msft", label: "MSFT" },
    { value: "appl", label: "APPL" },
    { value: "nvda", label: "NVDA" },
    { value: "goog", label: "GOOG" },
    { value: "tsla", label: "TSLA" },
    { value: "amzn", label: "AMZN" },
    { value: "intc", label: "INTC" },
    { value: "amd", label: "AMD" },
  ];

  const form = useForm<z.infer<typeof securityRowSchema>>({
    resolver: zodResolver(securityRowSchema),
    defaultValues: {
      stocks: [
        {
          ticker: "",
          minWeight: 0,
          maxWeight: 1,
        },
      ],
    },
  });

  //const optimizationMethod = form.watch("optimization.optimizationMethod");

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof securityRowSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("hello");
    console.log(values);
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between p-24">
      <div className="absolute top-0 right-0 m-4">
        <ModeToggle />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="container mx-auto px-4 py-8 md:px-6 md:py-12 space-y-8"
        >
          <div className="space-y-8">
            <PortfolioTable
              title="Stocks"
              type="stocks"
              tickerData={tickerData}
              form={form}
            />
            {/* <PortfolioTable
              title="ETFs"
              type="etfs"
              tickerData={tickerData}
              form={form}
            /> */}
          </div>

          <Separator />

          <Button type="submit" className="mt-12 rounded-lg px-6 py-3">
            Submit
          </Button>
        </form>
      </Form>
    </main>
  );
}
