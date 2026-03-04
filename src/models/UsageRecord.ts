/**
 * Usage Record model
 * Represents a snapshot of token usage at a specific point in time
 */

export interface UsageRecord {
  id: string;
  platformAccountId: string;
  tokensUsed: number;
  tokensRemaining: number;
  quotaTotal: number;
  timestamp: string;
  nextResetTime?: string;
}

export type UsageRecordCreate = Omit<UsageRecord, 'id'>;

/**
 * Calculate usage percentage from tokens used and total quota
 */
export function calculateUsagePercent(tokensUsed: number, quotaTotal: number): number {
  if (quotaTotal <= 0) return 0;
  return Math.round((tokensUsed / quotaTotal) * 100 * 100) / 100; // Round to 2 decimal places
}
