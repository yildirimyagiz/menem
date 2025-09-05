import { z } from "zod";

// Currency Schema
export const CurrencySchema = z.object({
  id: z.string(),
  code: z.string().min(2).max(3),
  name: z.string(),
  symbol: z.string(),
  exchangeRate: z.number().positive(),
  isActive: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date(),
  
  // Relations
  Expense: z.array(z.any()).optional(),
  Payment: z.array(z.any()).optional(),
  Reservation: z.array(z.any()).optional(),
  Property: z.array(z.any()).optional(),
  PricingRule: z.array(z.any()).optional(),
  users: z.array(z.any()).optional(), // Users who have selected this as their preferred currency
  TaxRecord: z.array(z.any()).optional(),
});

// Create Currency Schema
export const CreateCurrencySchema = z.object({
  code: z.string().min(2).max(3),
  name: z.string(),
  symbol: z.string(),
  exchangeRate: z.number().positive(),
  isActive: z.boolean().default(true),
});

// Update Currency Schema
export const UpdateCurrencySchema = z.object({
  id: z.string(),
  code: z.string().min(2).max(3).optional(),
  name: z.string().optional(),
  symbol: z.string().optional(),
  exchangeRate: z.number().positive().optional(),
  isActive: z.boolean().optional(),
});

// Currency Filter Schema
export const CurrencyFilterSchema = z.object({
  code: z.string().optional(),
  name: z.string().optional(),
  isActive: z.boolean().optional(),
  exchangeRateMin: z.number().optional(),
  exchangeRateMax: z.number().optional(),
  createdAtFrom: z.date().optional(),
  createdAtTo: z.date().optional(),
  updatedAtFrom: z.date().optional(),
  updatedAtTo: z.date().optional(),
  sortBy: z.enum(["code", "name", "exchangeRate", "createdAt", "updatedAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
});

// Zod Type Inference for TypeScript
export type Currency = z.infer<typeof CurrencySchema>;
export type CreateCurrencyInput = z.infer<typeof CreateCurrencySchema>;
export type UpdateCurrencyInput = z.infer<typeof UpdateCurrencySchema>;
export type CurrencyFilterInput = z.infer<typeof CurrencyFilterSchema>;
