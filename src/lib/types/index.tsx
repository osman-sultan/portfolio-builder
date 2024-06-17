import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { FormSchema } from "../schemas";

export type Ticker = {
  value: string;
  label: string;
};

export type PortfolioTableProps = {
  title: "Stocks" | "ETFs";
  type: "stocks" | "etfs";
  tickerData: Ticker[];
  form: UseFormReturn<z.infer<typeof FormSchema>>;
};
