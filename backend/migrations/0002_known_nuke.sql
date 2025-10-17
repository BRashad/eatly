ALTER TABLE "product_ingredients" ALTER COLUMN "is_top_level" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "product_ingredients" ALTER COLUMN "is_top_level" SET DEFAULT true;