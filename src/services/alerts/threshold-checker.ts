/**
 * Threshold Checking Service
 * Compares usage against thresholds and returns status
 */

import { UsageStatus } from '../../models/types';
import { ThresholdConfig } from '../../models/ThresholdConfig';

/**
 * Check usage against threshold config and return status
 */
export function checkThreshold(
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
 * Check multiple usages against their configs
 */
export function checkMultipleThresholds(
  usages: Array<{
    usagePercent: number;
    thresholdConfig?: ThresholdConfig | null;
  }>
): Array<{
  usagePercent: number;
  status: UsageStatus;
}> {
  return usages.map(({ usagePercent, thresholdConfig }) => ({
    usagePercent,
    status: checkThreshold(
      usagePercent,
      thresholdConfig?.warningPercent ?? 70,
      thresholdConfig?.criticalPercent ?? 90
    ),
  }));
}

/**
 * Get alert level for a usage percentage
 */
export function getAlertLevel(
  usagePercent: number,
  warningPercent: number = 70,
  criticalPercent: number = 90
): 'none' | 'warning' | 'critical' {
  if (usagePercent >= criticalPercent) {
    return 'critical';
  } else if (usagePercent >= warningPercent) {
    return 'warning';
  }
  return 'none';
}

/**
 * Calculate how close to threshold
 */
export function getThresholdDistance(
  usagePercent: number,
  warningPercent: number = 70,
  criticalPercent: number = 90
): {
  distanceToWarning: number;
  distanceToCritical: number;
  isOverWarning: boolean;
  isOverCritical: boolean;
} {
  const distanceToWarning = warningPercent - usagePercent;
  const distanceToCritical = criticalPercent - usagePercent;

  return {
    distanceToWarning,
    distanceToCritical,
    isOverWarning: usagePercent >= warningPercent,
    isOverCritical: usagePercent >= criticalPercent,
  };
}

/**
 * Filter platforms by alert status
 */
export function filterByAlertStatus<T extends { usagePercent: number; thresholdConfig?: ThresholdConfig | null }>(
  items: T[],
  status: UsageStatus
): T[] {
  return items.filter((item) => {
    const itemStatus = checkThreshold(
      item.usagePercent,
      item.thresholdConfig?.warningPercent ?? 70,
      item.thresholdConfig?.criticalPercent ?? 90
    );
    return itemStatus === status;
  });
}

/**
 * Get summary of alert statuses
 */
export function getAlertSummary<T extends { usagePercent: number; thresholdConfig?: ThresholdConfig | null }>(
  items: T[]
): {
  normal: number;
  warning: number;
  critical: number;
  total: number;
} {
  const summary = { normal: 0, warning: 0, critical: 0, total: items.length };

  for (const item of items) {
    const status = checkThreshold(
      item.usagePercent,
      item.thresholdConfig?.warningPercent ?? 70,
      item.thresholdConfig?.criticalPercent ?? 90
    );
    summary[status]++;
  }

  return summary;
}
