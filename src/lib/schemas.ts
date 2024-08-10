import { z } from "zod";

export const SECTORS = [
  "Technology",
  "Financial Services",
  "Healthcare",
  "Consumer Cyclical",
  "Communication Services",
  "Industrials",
  "Consumer Defensive",
  "Energy",
  "Utilities",
  "Real Estate",
  "Basic Materials",
] as const;

const SectorSchema = z.enum(SECTORS).optional();

export const OPTIMIZATION_METHODS = [
  "maximize_return",
  "minimize_risk",
  "maximize_sharpe_ratio",
  "maximize_diversification_factor",
  "risk_parity",
] as const;

export const OptimizationMethodSchema = z.enum(OPTIMIZATION_METHODS);

const WeightSchema = z.object({
  minWeight: z.coerce
    .number({ message: "Min weight must be a number" })
    .min(0, { message: "Min weight must be at least 0" })
    .max(1, { message: "Min weight must be at most 1" })
    .optional(),
  maxWeight: z.coerce
    .number({ message: "Max weight must be a number" })
    .min(0, { message: "Max weight must be at least 0" })
    .max(1, { message: "Max weight must be at most 1" })
    .optional(),
});

const SectorWeightsSchema = z.record(z.string(), WeightSchema).optional();

const SecurityRowSchema = z
  .object({
    ticker: z.string().min(1, { message: "Ticker is required" }),
    minWeight: z.coerce
      .number({ message: "Min. Weight must be a number" })
      .optional(),
    maxWeight: z.coerce
      .number({ message: "Max. Weight must be a number" })
      .optional(),
    sector: SectorSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.minWeight !== undefined && data.maxWeight !== undefined) {
      if (data.minWeight >= data.maxWeight) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Min. Weight must be less than Max. Weight",
          path: ["minWeight"],
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Max. Weight must be greater than Min. Weight",
          path: ["maxWeight"],
        });
      }
    }
  });

const CommonSchema = z.object({
  shortSell: z.boolean().optional(),
  alphaDecay: z.coerce
    .number()
    .gt(0, { message: "Alpha decay must be greater than 0" })
    .optional(),
  maxLeverage: z.coerce
    .number()
    .gt(0, { message: "Max leverage must be greater than 0" })
    .optional(),
  sectorWeights: SectorWeightsSchema,
});

const MaximizeReturnSchema = z
  .object({
    optimizationMethod: z.literal("maximize_return"),
    maxRisk: z.coerce
      .number()
      .min(0, { message: "Max risk must be at least 0" })
      .max(1, { message: "Max risk must be at most 1" }),
  })
  .merge(CommonSchema);

const MinimizeRiskSchema = z
  .object({
    optimizationMethod: z.literal("minimize_risk"),
    minReturn: z.coerce
      .number()
      .min(0, { message: "Min return must be at least 0" })
      .max(1, { message: "Min return must be at most 1" }),
  })
  .merge(CommonSchema);

const MaximizeSharpeRatioSchema = z
  .object({
    optimizationMethod: z.literal("maximize_sharpe_ratio"),
  })
  .merge(CommonSchema);

const MaximizeDiversificationFactorSchema = z
  .object({
    optimizationMethod: z.literal("maximize_diversification_factor"),
  })
  .merge(CommonSchema);

const BudgetRowSchema = z.object({
  stock: z.string().min(1, { message: "Stock is required" }),
  weight: z.coerce
    .number({ message: "Weight must be a number" })
    .min(0, { message: "Weight must be at least 0" }),
});

const RiskParitySchema = z.object({
  optimizationMethod: z.literal("risk_parity"),
  budget: z.array(BudgetRowSchema),
  alphaDecay: z.coerce
    .number()
    .gt(0, { message: "Alpha decay must be greater than 0" })
    .optional(),
});

const FormSchema = z.object({
  stocks: z.array(SecurityRowSchema),
  optimizationMethod: z.discriminatedUnion("optimizationMethod", [
    MaximizeReturnSchema,
    MinimizeRiskSchema,
    MaximizeSharpeRatioSchema,
    MaximizeDiversificationFactorSchema,
    RiskParitySchema,
  ]),
});

export { FormSchema };
