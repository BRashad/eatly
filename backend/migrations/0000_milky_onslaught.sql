
CREATE TABLE "ingredient_analysis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"common_names" text[] DEFAULT '{}' NOT NULL,
	"risk_level" text DEFAULT 'LOW' NOT NULL,
	"health_impact" text,
	"regulatory_status" text,
	"sources" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ingredient_analysis_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "product_ingredients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"ingredient_name" text NOT NULL,
	"is_top_level" boolean DEFAULT true NOT NULL,
	"position" integer,
	"percentage" integer,
	"added_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"barcode" text NOT NULL,
	"name" text NOT NULL,
	"brand" text,
	"description" text,
	"ingredients" text[] DEFAULT '{}' NOT NULL,
	"health_score" integer,
	"allergens" text[] DEFAULT '{}' NOT NULL,
	"warnings" text[] DEFAULT '{}' NOT NULL,
	"nutrition_info" text,
	"image_url" text,
	"source" text DEFAULT 'manual' NOT NULL,
	"external_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_barcode_unique" UNIQUE("barcode")
);
--> statement-breakpoint
CREATE TABLE "user_scan_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"product_id" uuid NOT NULL,
	"scanned_at" timestamp DEFAULT now() NOT NULL,
	"device_info" text
);
--> statement-breakpoint
ALTER TABLE "product_ingredients" ADD CONSTRAINT "product_ingredients_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_scan_history" ADD CONSTRAINT "user_scan_history_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_ingredient_analysis_name" ON "ingredient_analysis" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_ingredient_analysis_risk_level" ON "ingredient_analysis" USING btree ("risk_level");--> statement-breakpoint
CREATE INDEX "idx_product_ingredients_product_id" ON "product_ingredients" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_product_ingredients_ingredient_name" ON "product_ingredients" USING btree ("ingredient_name");--> statement-breakpoint
CREATE INDEX "idx_products_barcode" ON "products" USING btree ("barcode");--> statement-breakpoint
CREATE INDEX "idx_products_name" ON "products" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_products_source_external_id" ON "products" USING btree ("source","external_id");--> statement-breakpoint
CREATE INDEX "idx_user_scan_history_user_id" ON "user_scan_history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_scan_history_user_scanned_at" ON "user_scan_history" USING btree ("user_id","scanned_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_user_scan_history_product_id" ON "user_scan_history" USING btree ("product_id");