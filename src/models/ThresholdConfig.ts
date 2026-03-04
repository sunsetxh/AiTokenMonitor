/**
 * Threshold Configuration model
 * Stores usage threshold settings for alerts
 */

export interface ThresholdConfig {
  id: string;
  platformAccountId: string;
  warningPercent: number;
  criticalPercent: number;
  notificationsEnabled: boolean;
  updatedAt: string;
}

export type ThresholdConfigCreate = Omit<ThresholdConfig, 'id'>;

// Default threshold values
export const DEFAULT_WARNING_PERCENT = 70;
export const DEFAULT_CRITICAL_PERCENT = 90;
