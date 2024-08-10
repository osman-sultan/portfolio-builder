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
                                  <Input
                                    type="number"
                                    {...field}
                                    value={
                                      field.value?.[sector]?.minWeight || ""
                                    }
                                    onChange={(e) => {
                                      const newSectorWeights = {
                                        ...field.value,
                                      };
                                      newSectorWeights[sector] = {
                                        ...newSectorWeights[sector],
                                        minWeight: parseFloat(e.target.value),
                                      };
                                      field.onChange(newSectorWeights);
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    {...field}
                                    value={
                                      field.value?.[sector]?.maxWeight || ""
                                    }
                                    onChange={(e) => {
                                      const newSectorWeights = {
                                        ...field.value,
                                      };
                                      newSectorWeights[sector] = {
                                        ...newSectorWeights[sector],
                                        maxWeight: parseFloat(e.target.value),
                                      };
                                      field.onChange(newSectorWeights);
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CollapsibleContent>
                    </Collapsible>
                    <FormMessage />
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
                      {form.watch("stocks").length > 0 ? (
                        form.watch("stocks").map((stock, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {stock.ticker
                                ? stock.ticker.toUpperCase()
                                : "Ticker not selected..."}
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                {...field}
                                value={field.value?.[index]?.weight || ""}
                                onChange={(e) => {
                                  const newBudget = [...(field.value || [])];
                                  newBudget[index] = {
                                    stock: stock.ticker,
                                    weight: parseFloat(e.target.value),
                                  };
                                  field.onChange(newBudget);
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center">
                            No stocks added yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" className="mt-12 rounded-lg px-6 py-3">
            Submit
          </Button>
        </form>
      </Form>
    </main>
  );
}
