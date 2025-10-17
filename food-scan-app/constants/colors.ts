/**
 * Centralized color palette for the Food Scan App
 * Improves consistency and enables easier theme switching (dark mode support)
 */

export const COLORS = {
  // Background colors
  BACKGROUND_PRIMARY: '#FFFFFF',
  BACKGROUND_SECONDARY: '#F3F4F6',
  
  // Text colors
  TEXT_PRIMARY: '#111827', // gray-900
  TEXT_SECONDARY: '#6B7280', // gray-500
  TEXT_PLACEHOLDER: '#9CA3AF', // gray-400
  
  // Status colors
  SUCCESS: '#10B981', // green-500
  WARNING: '#F59E0B', // amber-500
  ERROR: '#EF4444', // red-500
  INFO: '#3B82F6', // blue-500
  
  // Border colors
  BORDER_DEFAULT: '#E5E7EB', // gray-200
  BORDER_FOCUS: '#3B82F6', // blue-500
  
  // Input colors
  INPUT_BACKGROUND: '#FFFFFF',
  INPUT_BORDER: '#D1D5DB', // gray-300
  
  // Health score colors (will be used for health indicators)
  HEALTH_HIGH_RISK: '#DC2626', // red-600
  HEALTH_MEDIUM_RISK: '#F59E0B', // amber-500
  HEALTH_LOW_RISK: '#10B981', // green-500
} as const;

export type ColorKey = keyof typeof COLORS;
