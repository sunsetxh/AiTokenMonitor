/**
 * Usage Aggregation Service
 * Aggregates and calculates derived usage data
 */

import { calculateUsagePercent } from '../../models/UsageRecord';
import { CurrentUsageView, createCurrentUsageView } from '../../models/CurrentUsageView';
import { calculateDataFreshness, isStale } from '../../utils/date';
import { getAllPlatformAccounts } from '../storage/storage-service';
import { getLatestUsage, getThresholdConfig } from '../api/backend-api';

/**
 * Aggregate all current usage data
 * @returns Array of CurrentUsageView for all platforms
 */
export async function aggregateAllUsage(): Promise<CurrentUsageView[]> {
  const accounts = await getAllPlatformAccounts();
  console.log('[aggregateAllUsage] accounts:', accounts.map(a => ({ id: a.id, platform: a.platformName })));
  const latestRecords = await getLatestUsage();
  console.log('[aggregateAllUsage] latestRecords keys:', Array.from(latestRecords.keys()));

  const thresholdMap = new Map<string, { warningPercent: number; criticalPercent: number }>();

  // Load threshold configs for each account
  for (const account of accounts) {
    const threshold = await getThresholdConfig(account.id);
    if (threshold) {
      thresholdMap.set(account.id, threshold);
    }
  }

  const views: CurrentUsageView[] = [];

  for (const account of accounts) {
    const record = latestRecords.get(account.id);
    const threshold = thresholdMap.get(account.id);

    if (record) {
      const warningPercent = threshold?.warningPercent ?? 70;
      const criticalPercent = threshold?.criticalPercent ?? 90;

      views.push(
        createCurrentUsageView(
          account.id,
          account.platformName as any,
          account.accountLabel,
          record.tokensUsed,
          record.tokensRemaining,
          record.quotaTotal,
          record.timestamp,
          warningPercent,
          criticalPercent,
          record.nextResetTime
        )
      );
    } else {
      // No usage data yet - create placeholder view
      views.push({
        platformAccountId: account.id,
        platformName: account.platformName as any,
        accountLabel: account.accountLabel,
        tokensUsed: 0,
        tokensRemaining: 0,
        quotaTotal: 0,
        usagePercent: 0,
        status: 'normal',
        lastUpdate: account.createdAt,
        dataFreshness: calculateDataFreshness(account.createdAt),
        nextResetTime: undefined,
      });
    }
  }

  return views;
}

/**
 * Aggregate usage for specific platforms
 * @param platformAccountIds - Array of platform account IDs
 * @returns Array of CurrentUsageView
 */
export async function aggregateSpecificUsage(platformAccountIds: string[]): Promise<CurrentUsageView[]> {
  const allViews = await aggregateAllUsage();
  const viewMap = new Map(allViews.map((v) => [v.platformAccountId, v]));

  return platformAccountIds
    .map((id) => viewMap.get(id))
    .filter((v): v is CurrentUsageView => v !== undefined);
}

/**
 * Get usage summary statistics
 * @returns Summary stats
 */
export async function getUsageSummary(): Promise<{
  totalPlatforms: number;
  activePlatforms: number;
  totalTokensUsed: number;
  totalQuota: number;
  overallUsagePercent: number;
  platformsInCritical: number;
  platformsInWarning: number;
}> {
  const views = await aggregateAllUsage();

  let totalTokensUsed = 0;
  let totalQuota = 0;
  let activePlatforms = 0;
  let platformsInCritical = 0;
  let platformsInWarning = 0;

  for (const view of views) {
    if (view.quotaTotal > 0) {
      totalTokensUsed += view.tokensUsed;
      totalQuota += view.quotaTotal;
      activePlatforms++;

      if (view.status === 'critical') {
        platformsInCritical++;
      } else if (view.status === 'warning') {
        platformsInWarning++;
      }
    }
  }

  return {
    totalPlatforms: views.length,
    activePlatforms,
    totalTokensUsed,
    totalQuota,
    overallUsagePercent: totalQuota > 0 ? calculateUsagePercent(totalTokensUsed, totalQuota) : 0,
    platformsInCritical,
    platformsInWarning,
  };
}

/**
 * Filter usage views by status
 * @param views - Array of CurrentUsageView
 * @param status - Status to filter by
 * @returns Filtered array
 */
export function filterByStatus(views: CurrentUsageView[], status: 'normal' | 'warning' | 'critical'): CurrentUsageView[] {
  return views.filter((v) => v.status === status);
}

/**
 * Filter usage views by platform
 * @param views - Array of CurrentUsageView
 * @param platformNames - Array of platform names to include
 * @returns Filtered array
 */
export function filterByPlatform(views: CurrentUsageView[], platformNames: string[]): CurrentUsageView[] {
  return views.filter((v) => platformNames.includes(v.platformName));
}

/**
 * Get stale usage data
 * @param thresholdSeconds - Threshold in seconds (default: 300 = 5 minutes)
 * @returns Array of stale platform account IDs
 */
export async function getStaleUsage(thresholdSeconds: number = 300): Promise<string[]> {
  const views = await aggregateAllUsage();
  return views.filter((v) => isStale(v.lastUpdate, thresholdSeconds)).map((v) => v.platformAccountId);
}

/**
 * Check if any platform needs attention (critical, warning, or stale)
 * @returns Object with flags and details
 */
export async function getPlatformAlerts(): Promise<{
  hasAlerts: boolean;
  criticalPlatforms: CurrentUsageView[];
  warningPlatforms: CurrentUsageView[];
  stalePlatforms: CurrentUsageView[];
}> {
  const views = await aggregateAllUsage();
  const staleThreshold = 300; // 5 minutes

  return {
    hasAlerts:
      views.some((v) => v.status === 'critical' || v.status === 'warning') ||
      views.some((v) => isStale(v.lastUpdate, staleThreshold)),
    criticalPlatforms: filterByStatus(views, 'critical'),
    warningPlatforms: filterByStatus(views, 'warning'),
    stalePlatforms: views.filter((v) => isStale(v.lastUpdate, staleThreshold)),
  };
}
