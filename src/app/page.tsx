"use client";

import { FileUploadZone } from "@/components/file-upload-zone";
import { ModeToggle } from "@/components/mode-toggle";
import { PortfolioTable } from "@/components/portfolio-table";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import { FormSchema, OPTIMIZATION_METHODS, SECTORS } from "@/lib/schemas";
import type { Ticker } from "@/lib/types";
import { capitalize } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [tickerData, setTickerData] = useState<Ticker[]>([]);
  const [fullData, setFullData] = useState<any[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      stocks: [
        {
          ticker: "",
          minWeight: undefined,
          maxWeight: undefined,
          sector: undefined,
        },
      ],
      optimizationMethod: {
        optimizationMethod: "maximize_return", // Provide a default optimization method
        maxRisk: 0.5, // Default value for maxRisk in MaximizeReturnSchema
        alphaDecay: 0.1, // Default value for alphaDecay in CommonSchema
        maxLeverage: 1, // Default value for maxLeverage in CommonSchema
        shortSell: false, // Default value for shortSell in CommonSchema
        sectorWeights: SECTORS.reduce((acc, sector) => {
          acc[sector] = { minWeight: 0, maxWeight: 1 };
          return acc;
        }, {} as Record<string, { minWeight: number; maxWeight: number }>),
      },
    },
  });

  // WORK WITH THIS FUNCTION ONLY Mohamed Abdelwahab
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    console.log("Form answers: ", values);
    console.log("Full CSV data: ", fullData);

    const stockDict: { [key: string]: any } = {};
    for (const stock of values.stocks) {
      stockDict[stock.ticker] = {
        minWeight: stock.minWeight,
        maxWeight: stock.maxWeight,
        sector: stock.sector,
      };
    }
    console.log(stockDict);
  };

  const optimizationMethod = form.watch(
    "optimizationMethod.optimizationMethod"
  );

  const handleDataParsed = (
    tickerData: { value: string; label: string }[],
    fullData: any[]
  ) => {
    setTickerData(tickerData);
    setFullData(fullData);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between p-24">
      <div className="absolute top-0 right-0 m-4">
        <ModeToggle />
      </div>

      <FileUploadZone onDataParsed={handleDataParsed} />

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
          </div>

          <Separator />

          <FormField
            control={form.control}
            name="optimizationMethod.optimizationMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Optimization Method</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {OPTIMIZATION_METHODS.map((method) => (
                      <SelectItem key={method} value={method}>
                        {capitalize(method)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Determine the algorithm to use for optimization.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {optimizationMethod === "maximize_return" && (
            <>
              <FormField
                control={form.control}
                name="optimizationMethod.maxRisk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Risk</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="optimizationMethod.alphaDecay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alpha Decay</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="optimizationMethod.maxLeverage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Leverage</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="optimizationMethod.shortSell"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Short Sell</FormLabel>
                      <FormDescription>
                        Enable short selling in the portfolio.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="space-y-2"
              >
                <div className="flex items-center justify-between space-x-4">
                  <h4 className="text-sm">Sector Weights</h4>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                      <ChevronsUpDown className="h-4 w-4" />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="space-y-2">
                  <div className="space-y-4">
                    {SECTORS.map((sector) => (
                      <div key={sector} className="flex space-x-4">
                        <FormField
                          control={form.control}
                          name={`optimizationMethod.sectorWeights.${sector}.minWeight`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{sector} Min Weight</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`optimizationMethod.sectorWeights.${sector}.maxWeight`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{sector} Max Weight</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </>
          )}

          {optimizationMethod === "minimize_risk" && (
            <>
              <FormField
                control={form.control}
                name="optimizationMethod.minReturn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Return</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="optimizationMethod.alphaDecay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alpha Decay</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="optimizationMethod.maxLeverage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Leverage</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="optimizationMethod.shortSell"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Short Sell</FormLabel>
                      <FormDescription>
                        Enable short selling in the portfolio.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="space-y-2"
              >
                <div className="flex items-center justify-between space-x-4">
                  <h4 className="text-sm">Sector Weights</h4>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                      <ChevronsUpDown className="h-4 w-4" />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="space-y-2">
                  <div className="space-y-4">
                    {SECTORS.map((sector) => (
                      <div key={sector} className="flex space-x-4">
                        <FormField
                          control={form.control}
                          name={`optimizationMethod.sectorWeights.${sector}.minWeight`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{sector} Min Weight</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`optimizationMethod.sectorWeights.${sector}.maxWeight`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{sector} Max Weight</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </>
          )}

          {[
            "maximize_sharpe_ratio",
            "maximize_diversification_factor",
            "risk_parity",
          ].includes(optimizationMethod) && (
            <>
              <FormField
                control={form.control}
                name="optimizationMethod.alphaDecay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alpha Decay</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="space-y-2"
              >
                <div className="flex items-center justify-between space-x-4">
                  <h4 className="text-sm">Sector Weights</h4>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                      <ChevronsUpDown className="h-4 w-4" />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="space-y-2">
                  <div className="space-y-4">
                    {SECTORS.map((sector) => (
                      <div key={sector} className="flex space-x-4">
                        <FormField
                          control={form.control}
                          name={`optimizationMethod.sectorWeights.${sector}.minWeight`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{sector} Min Weight</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`optimizationMethod.sectorWeights.${sector}.maxWeight`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{sector} Max Weight</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </>
          )}

          <Button type="submit" className="mt-12 rounded-lg px-6 py-3">
            Submit
          </Button>
        </form>
      </Form>
    </main>
  );
}
