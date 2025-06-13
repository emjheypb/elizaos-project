import { z } from "zod";

// Zod schemas for validation
export const BalanceResponseSchema = z
  .object({
    balance: z.number(),
    payout: z.number().optional(),
    // Add more fields based on actual Kalshi balance API response
  })
  .passthrough(); // Allow additional fields

// Type inference from schemas
export type BalanceResponse = z.infer<typeof BalanceResponseSchema>;
