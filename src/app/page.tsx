"use client";

import { FileUploadZone } from "@/components/file-upload-zone";
import { ModeToggle } from "@/components/mode-toggle";
import { PortfolioTable } from "@/components/portfolio-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { FormSchema, OPTIMIZATION_METHODS, SECTORS } from "@/lib/schemas";
import type { Ticker } from "@/lib/types";
import { capitalize } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [tickerData, setTickerData] = useState<Ticker[]>([]);
  const [fullData, setFullData] = useState<any[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
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
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#2d3748_1px,transparent_1px)] [background-size:16px_16px]"></div>
      {/* background */}
      <div className="fixed top-0 -z-10 h-full w-full">
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(34,139,34,0.5)] opacity-50 blur-[80px]"></div>
      </div>

      <div className="absolute top-0 right-0 m-4">
        <Image src="arrow.svg" width={100} height={100} alt="Arrow" />
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
                      <SelectValue placeholder="Select optimization method" />
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
            <FormField
              control={form.control}
              name="optimizationMethod.maxRisk"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Risk</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Maximum risk tolerance for the portfolio.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {optimizationMethod === "minimize_risk" && (
            <FormField
              control={form.control}
              name="optimizationMethod.minReturn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Return</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Minimum return target for the portfolio.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="optimizationMethod.alphaDecay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alpha Decay</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Rate of decay for alpha values.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {optimizationMethod !== "risk_parity" && (
            <>
              <FormField
                control={form.control}
                name="optimizationMethod.maxLeverage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Leverage</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Maximum leverage allowed in the portfolio.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Card>
                <CardContent className="pt-6">
                  <FormField
                    control={form.control}
                    name="optimizationMethod.shortSell"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start justify-between space-y-0">
                        <div>
                          <FormLabel className="text-sm font-semibold">
                            Short Sell
                          </FormLabel>
                          <FormDescription className="text-sm text-muted-foreground">
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
                </CardContent>
              </Card>

              <FormField
                control={form.control}
                name="optimizationMethod.sectorWeights"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sector Weights</FormLabel>
                    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-between"
                        >
                          <span className="text-sm text-muted-foreground font-normal">
                            {isOpen ? "Hide" : "Reveal"}
                          </span>
                          <ChevronsUpDown className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-2">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Sector</TableHead>
                              <TableHead>Min Weight</TableHead>
                              <TableHead>Max Weight</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {SECTORS.map((sector) => (
                              <TableRow key={sector}>
                                <TableCell>{sector}</TableCell>
                                <TableCell>
                                  <FormField
                                    control={form.control}
                                    name={`optimizationMethod.sectorWeights.${sector}.minWeight`}
                                    render={({ field: minWeightField }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            {...minWeightField}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              minWeightField.onChange(
                                                value === ""
                                                  ? ""
                                                  : parseFloat(value)
                                              );
                                            }}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                                <TableCell>
                                  <FormField
                                    control={form.control}
                                    name={`optimizationMethod.sectorWeights.${sector}.maxWeight`}
                                    render={({ field: maxWeightField }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            {...maxWeightField}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              maxWeightField.onChange(
                                                value === ""
                                                  ? ""
                                                  : parseFloat(value)
                                              );
                                            }}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CollapsibleContent>
                    </Collapsible>
                  </FormItem>
                )}
              />
            </>
          )}

          {optimizationMethod === "risk_parity" && (
            <FormField
              control={form.control}
              name="optimizationMethod.budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget</FormLabel>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Stock</TableHead>
                        <TableHead>Weight</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {form.watch("stocks").map((stock, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {stock.ticker
                              ? stock.ticker.toUpperCase()
                              : "No Ticker selected"}
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`optimizationMethod.budget.${index}.weight`}
                              render={({ field: weightField }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...weightField}
                                      value={weightField.value ?? ""}
                                      onChange={(e) => {
                                        const value =
                                          e.target.value === ""
                                            ? null
                                            : parseFloat(e.target.value);
                                        weightField.onChange(value);
                                        form.trigger(
                                          `optimizationMethod.budget.${index}.weight`
                                        );
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </FormItem>
              )}
            />
          )}

          <Button type="submit" className="mt-12 rounded-lg px-6 py-3">
            Optimize 📈
          </Button>
        </form>
      </Form>
    </main>
  );
}
