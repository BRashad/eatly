import rateLimit from "express-rate-limit";
import type { Request, Response } from "express";

// Rate limiting configuration for different endpoint types
const rateLimitConfig = {
  // Strict rate limiting for external API calls (prevent abuse)
  externalApi: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 requests per window per IP
    message: {
      error: "RATE_LIMIT_EXCEEDED",
      message: "Too many external API requests, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Moderate rate limiting for bulk operations
  bulkImport: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 bulk imports per hour per IP
    message: {
      error: "RATE_LIMIT_EXCEEDED",
      message: "Too many bulk import requests, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
  },

  // General rate limiting for regular operations
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window per IP
    message: {
      error: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
  },
};

// Create rate limiters for different use cases
export const externalApiRateLimiter = rateLimit(rateLimitConfig.externalApi);

export const bulkImportRateLimiter = rateLimit(rateLimitConfig.bulkImport);

export const generalRateLimiter = rateLimit(rateLimitConfig.general);

// Unified rate limiter that can be used as default
export const rateLimiter = generalRateLimiter;
