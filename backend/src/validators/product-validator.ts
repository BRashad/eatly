import { z } from "zod";

export const BarcodeParamSchema = z.object({
  barcode: z
    .string({ required_error: "BARCODE_REQUIRED" })
    .min(8, "BARCODE_TOO_SHORT")
    .max(32, "BARCODE_TOO_LONG")
    .regex(/^\d+$/, "BARCODE_INVALID"),
});

export type BarcodeParam = z.infer<typeof BarcodeParamSchema>;
