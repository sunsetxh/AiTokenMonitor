/**
 * Current Usage View model
 * Derived view combining platform account with latest usage data
 */

import { PlatformType, UsageStatus } from './types';
import { calculateUsagePercent } from './UsageRecord';

export interface CurrentUsageView {
  platformAccountId: string;
  platformName: PlatformType;
  accountLabel: string;
  tokensUsed: number;
  tokensRemaining: number;
  quotaTotal: number;
  usagePercent: number;
  status: UsageStatus;
  lastUpdate: string;
  dataFreshness: number; // seconds since last update
  nextResetTime?: string;
}

/**
 * Determine usage status based on percentage and thresholds
 */
export function determineStatus(
  usagePercent: number,
  warningPercent: number = 70,
  criticalPercent: number = 90
): UsageStatus {
  if (usagePercent >= criticalPercent) {
    return 'critical';
  } else if (usagePercent >= warningPercent) {
    return 'warning';
  }
  return 'normal';
}

/**
 * Create a CurrentUsageView from platform account and usage record
 */
export function createCurrentUsageView(
  platformAccountId: string,
  platformName: PlatformType,
  accountLabel: string,
  tokensUsed: number,
  tokensRemaining: number,
  quotaTotal: number,
  lastUpdate: string,
  warningPercent: number = 70,
  criticalPercent: number = 90,
  nextResetTime?: string
): CurrentUsageView {
  const usagePercent = calculateUsagePercent(tokensUsed, quotaTotal);
  const status = determineStatus(usagePercent, warningPercent, criticalPercent);

  return {
    platformAccountId,
    platformName,
    accountLabel,
    tokensUsed,
    tokensRemaining,
    quotaTotal,
    usagePercent,
    status,
    lastUpdate,
    dataFreshness: Math.floor((Date.now() - new Date(lastUpdate).getTime()) / 1000),
    nextResetTime,
  };
}
