import { z } from "zod";

export const BarcodeParamSchema = z.object({
  barcode: z
    .string({ required_error: "BARCODE_REQUIRED" })
    .min(8, "BARCODE_TOO_SHORT")
    .max(32, "BARCODE_TOO_LONG")
    .regex(/^\d+$/, "BARCODE_INVALID"),
});

export type BarcodeParam = z.infer<typeof BarcodeParamSchema>;

// Validation schema for bulk import endpoint
export const BulkImportSchema = z
  .object({
    searchTerms: z
      .array(z.string().min(1, "SEARCH_TERM_EMPTY").max(100, "SEARCH_TERM_TOO_LONG"))
      .min(1, "SEARCH_TERMS_REQUIRED")
      .max(5, "SEARCH_TERMS_TOO_MANY"),
    limitPerTerm: z
      .number()
      .int("LIMIT_MUST_BE_INTEGER")
      .min(1, "LIMIT_TOO_SMALL")
      .max(50, "LIMIT_TOO_LARGE")
      .optional()
      .default(10),
  })
  .superRefine((data, ctx) => {
    // Additional validation to ensure all search terms are meaningful
    const validTerms = data.searchTerms.filter(
      (term) => term.trim().length > 0
    );
    
    if (validTerms.length !== data.searchTerms.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "SEARCH_TERMS_CONTAIN_EMPTY",
        path: ["searchTerms"],
      });
    }
  });

export type BulkImportRequest = z.infer<typeof BulkImportSchema>;
