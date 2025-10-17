import type { Request, Response, NextFunction } from "express";
import type { ZodSchema, ZodError } from "zod";

/**
 * Middleware factory that creates request body validation
 * @param schema Zod schema to validate against
 * @returns Express middleware function
 */
export function validateRequest<BodyType = unknown>(
  schema: ZodSchema<BodyType>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate request body
      const validationResult = schema.parse(req.body);
      
      // Attach validated data to request object
      (req as any).validatedBody = validationResult;
      
      next();
    } catch (error) {
      if (error && typeof error === "object" && "issues" in error) {
        // Handle Zod validation errors
        const zodError = error as ZodError;
        
        res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Invalid request body",
          details: zodError.errors.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
            code: issue.code,
          })),
        });
      } else {
        // Handle other validation errors
        res.status(400).json({
          error: "VALIDATION_ERROR", 
          message: "Request validation failed",
        });
      }
    }
  };
}

/**
 * Middleware factory that creates request parameter validation
 * @param schema Zod schema to validate against
 * @returns Express middleware function
 */
export function validateParams<ParamsType = unknown>(
  schema: ZodSchema<ParamsType>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validationResult = schema.parse(req.params);
      
      // Attach validated params to request object
      (req as any).validatedParams = validationResult;
      
      next();
    } catch (error) {
      if (error && typeof error === "object" && "issues" in error) {
        // Handle Zod validation errors
        const zodError = error as ZodError;
        
        res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Invalid request parameters",
          details: zodError.errors.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
            code: issue.code,
          })),
        });
      } else {
        // Handle other validation errors
        res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Request parameter validation failed",
        });
      }
    }
  };
}
