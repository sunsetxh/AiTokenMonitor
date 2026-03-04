/**
 * Trends Data Service
 * Fetches and aggregates historical usage data
 */

import { getUsageRecordsByTimeRange, getAllPlatformAccounts } from '../storage/storage-service';

export interface TrendDataPoint {
  date: string;
  timestamp: string;
  platformName: string;
  tokensUsed: number;
  tokensRemaining: number;
  quotaTotal: number;
}

/**
 * Get trends data for specified date range and platforms
 */
export async function getTrendsData(
  startDate: Date,
  endDate: Date,
  platformFilter: string[] = []
): Promise<TrendDataPoint[]> {
  const accounts = await getAllPlatformAccounts();

  // Filter accounts if platform filter is specified
  const filteredAccounts = platformFilter.length > 0
    ? accounts.filter((a) => platformFilter.includes(a.platformName))
    : accounts;

  const allData: TrendDataPoint[] = [];

  // Fetch data for each account
  for (const account of filteredAccounts) {
    const records = await getUsageRecordsByTimeRange(
      account.id,
      startDate,
      endDate
    );

    // Aggregate by date (take the last record of each day)
    const byDate = new Map<string, TrendDataPoint>();

    for (const record of records) {
      const date = record.timestamp.split('T')[0]; // Get just the date part

      // Keep the latest record for each day
      if (!byDate.has(date) || byDate.get(date)!.timestamp < record.timestamp) {
        byDate.set(date, {
          date,
          timestamp: record.timestamp,
          platformName: account.accountLabel,
          tokensUsed: record.tokensUsed,
          tokensRemaining: record.tokensRemaining,
          quotaTotal: record.quotaTotal,
        });
      }
    }

    allData.push(...byDate.values());
  }

  // Sort by date
  return allData.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Aggregate data by platform
 */
export function aggregateByPlatform(data: TrendDataPoint[]): Map<string, TrendDataPoint[]> {
  const byPlatform = new Map<string, TrendDataPoint[]>();

  for (const point of data) {
    const existing = byPlatform.get(point.platformName) || [];
    existing.push(point);
    byPlatform.set(point.platformName, existing);
  }

  return byPlatform;
}

/**
 * Calculate daily average for a platform
 */
export function calculateDailyAverage(data: TrendDataPoint[]): number {
  if (data.length === 0) return 0;

  const total = data.reduce((sum, d) => sum + d.tokensUsed, 0);
  return Math.round(total / data.length);
}

/**
 * Get trend direction (increasing/decreasing/stable)
 */
export function getTrendDirection(data: TrendDataPoint[]): 'up' | 'down' | 'stable' {
  if (data.length < 2) return 'stable';

  // Compare first half average to second half average
  const mid = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, mid);
  const secondHalf = data.slice(mid);

  const firstAvg = firstHalf.reduce((s, d) => s + d.tokensUsed, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((s, d) => s + d.tokensUsed, 0) / secondHalf.length;

  const diff = ((secondAvg - firstAvg) / firstAvg) * 100;

  if (diff > 10) return 'up';
  if (diff < -10) return 'down';
  return 'stable';
}
