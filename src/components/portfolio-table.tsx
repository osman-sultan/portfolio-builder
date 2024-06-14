"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PortfolioTableProps } from "@/lib/types";
import { useFieldArray } from "react-hook-form";

export const PortfolioTable = ({
  title,
  type,
  tickerData,
  form,
}: PortfolioTableProps) => {
  const { fields, append, remove } = useFieldArray({
    name: "stocks",
    control: form.control,
  });

  const addRow = () => {
    append({ ticker: "", minWeight: 0, maxWeight: 1 });
  };

  const deleteRow = (index: number) => {
    remove(index);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          A minimum 3 tickers are required for optimization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-3 text-left">Ticker</TableHead>
              <TableHead className="px-4 py-3 text-left">Min. Weight</TableHead>
              <TableHead className="px-4 py-3 text-left">Max. Weight</TableHead>
              <TableHead className="px-4 py-3 text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell className="px-4 py-3">
                  <FormField
                    control={form.control}
                    name={`stocks.${index}.ticker`}
                    render={({ field }) => (
                      <FormItem>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? tickerData.find(
                                      (ticker) => ticker.value === field.value
                                    )?.label
                                  : "Select ticker..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            align="start"
                            className="w-[200px] p-0"
                          >
                            <Command>
                              <CommandInput placeholder="Search tickers..." />
                              <CommandList>
                                <CommandEmpty>No ticker found.</CommandEmpty>
                                <CommandGroup>
                                  <ScrollArea className="h-32 w-48 rounded-md border">
                                    {tickerData.map((ticker) => (
                                      <CommandItem
                                        key={ticker.label}
                                        value={ticker.value}
                                        onSelect={() =>
                                          form.setValue(
                                            `stocks.${index}.ticker`,
                                            ticker.value
                                          )
                                        }
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            ticker.value === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {ticker.label}
                                      </CommandItem>
                                    ))}
                                  </ScrollArea>
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell className="px-4 py-3">
                  <FormField
                    control={form.control}
                    name={`stocks.${index}.minWeight`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input step="0.1" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell className="px-4 py-3">
                  <FormField
                    control={form.control}
                    name={`stocks.${index}.maxWeight`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input step="0.1" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell className="px-4 py-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Stock</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this stock?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <div>
                          <Button variant="ghost">Cancel</Button>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() => deleteRow(index)}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-end border-t p-4">
        <Button className="gap-1" onClick={addRow}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Stock
        </Button>
      </CardFooter>
    </Card>
  );
};