-- Add check constraint to ensure percentage is within valid range (0-100)
ALTER TABLE "product_ingredients" 
ADD CONSTRAINT "percentage_range" 
CHECK (percentage IS NULL OR (percentage >= 0 AND percentage <= 100));
