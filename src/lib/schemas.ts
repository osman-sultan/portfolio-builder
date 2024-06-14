import { z } from "zod";

export const securityRowSchema = z.object({
  stocks: z.array(
    z
      .object({
        ticker: z.string().min(1, { message: "Ticker is required" }),
        minWeight: z.coerce
          .number({ message: "Min. Weight must be a number" })
          .min(0, { message: "Min. Weight must be at least 0" })
          .max(1, { message: "Min. Weight must be at most 1" })
          .optional(),
        maxWeight: z.coerce
          .number({ message: "Max. Weight must be a number" })
          .min(0, { message: "Max. Weight must be at least 0" })
          .max(1, { message: "Max. Weight must be at most 1" })
          .optional(),
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
      })
  ),
});
