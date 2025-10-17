-- Add check constraint to ensure risk_level only accepts valid enum values
ALTER TABLE "ingredient_analysis" 
ADD CONSTRAINT "risk_level_check" 
CHECK (risk_level IN ('HIGH', 'MEDIUM', 'LOW'));
