/**
 * Usage Card Component
 * Displays token usage for a single platform
 */

import { CurrentUsageView } from '../../models/CurrentUsageView';
import { StatusBadge } from '../common/StatusBadge';
import { formatTimestamp, formatFreshness } from '../../utils/date';
import { PlatformType } from '@/models/types';

/**
 * Format next reset time for display
 */
function formatNextReset(nextResetTime?: string): string {
  if (!nextResetTime) return '';
  try {
    const resetDate = new Date(nextResetTime);
    const now = new Date();
    const diffMs = resetDate.getTime() - now.getTime();

    if (diffMs <= 0) return '即将刷新';

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    // Format time in local timezone
    const timeStr = resetDate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

    if (diffHours > 0) {
      return `${diffHours}h${diffMins}后刷新 (${timeStr})`;
    }
    return `${diffMins}分钟后刷新 (${timeStr})`;
  } catch {
    return '';
  }
}

/**
 * Get next reset time in milliseconds for page title
 */
export function getNextResetMs(nextResetTime?: string): number {
  if (!nextResetTime) return 0;
  try {
    const resetDate = new Date(nextResetTime);
    const now = new Date();
    const diffMs = resetDate.getTime() - now.getTime();
    return diffMs > 0 ? diffMs : 0;
  } catch {
    return 0;
  }
}

interface UsageCardProps {
  usage: CurrentUsageView;
}

// Platform-specific refresh info
const platformRefreshInfo: Record<PlatformType, { refreshHours: number; quotaType: string; hasWeekly: boolean }> = {
  zai: { refreshHours: 5, quotaType: '5小时', hasWeekly: false },
  minimax: { refreshHours: 4, quotaType: '4小时', hasWeekly: false },
};

export function UsageCard({ usage }: UsageCardProps) {
  const {
    platformName,
    accountLabel,
    tokensUsed,
    tokensRemaining,
    quotaTotal,
    usagePercent,
    status,
    lastUpdate,
    dataFreshness,
    nextResetTime,
  } = usage;

  const platformDisplayNames: Record<string, string> = {
    zai: 'Zai',
    minimax: 'MiniMax',
  };

  const refreshInfo = platformRefreshInfo[platformName as PlatformType] || { refreshHours: 5, quotaType: '月度', hasWeekly: false };

  // Determine card styling based on status
  const cardStyles = {
    normal: 'border-gray-200 dark:border-gray-700',
    warning: 'border-yellow-500 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
    critical: 'border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-900/20',
  };

  // Calculate progress bar styling
  const progressColor = {
    normal: 'bg-green-500',
    warning: 'bg-yellow-500',
    critical: 'bg-red-500',
  }[status];

  return (
    <div className={`border rounded-lg p-4 ${cardStyles[status]}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
            {platformDisplayNames[platformName]?.charAt(0) || platformName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{accountLabel}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{platformDisplayNames[platformName]}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Usage Stats */}
      <div className="space-y-2">
        {/* Progress Bar */}
        <div className="relative">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">
              {tokensUsed.toLocaleString()} / {quotaTotal.toLocaleString()} tokens
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">{usagePercent}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${progressColor} transition-all duration-300`}
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-3">
          <span>剩余: {tokensRemaining.toLocaleString()} tokens</span>
          <span title={formatTimestamp(lastUpdate, 'full')}>
            更新于 {formatFreshness(dataFreshness)}前
          </span>
        </div>

        {/* Platform-specific quota info */}
        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
            {refreshInfo.quotaType}
          </span>
          {refreshInfo.hasWeekly && (
            <span className="text-xs px-2 py-0.5 bg-primary-50 dark:bg-primary-900/30 rounded text-primary-600 dark:text-primary-400">
              周度配额
            </span>
          )}
          {nextResetTime && (
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">
              {formatNextReset(nextResetTime)}
            </span>
          )}
          {!nextResetTime && (
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">
              每 {refreshInfo.refreshHours}h 刷新
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
