/**
 * Dashboard Page
 * Main dashboard view integrating all components
 */

import { useState, useEffect } from 'react';
import { Dashboard } from './Dashboard';
import { UsageCard } from './UsageCard';
import { RefreshButton } from '../common/RefreshButton';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { aggregateAllUsage } from '../../services/usage/usage-aggregator';
import { fetchAllUsage } from '../../services/usage/usage-fetcher';
import { getAllPlatformAccounts } from '../../services/storage/storage-service';
import { CurrentUsageView } from '../../models/CurrentUsageView';

export function DashboardPage() {
  const [usageViews, setUsageViews] = useState<CurrentUsageView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data on mount and set up auto-refresh
  useEffect(() => {
    console.log('[Dashboard] useEffect triggered, calling loadUsageData');
    loadUsageData(true); // Force fetch on initial load

    // Auto-refresh every 2.5 hours
    const AUTO_REFRESH_INTERVAL = 2.5 * 60 * 60 * 1000; // 2.5 hours in ms
    const intervalId = setInterval(() => {
      console.log('[Dashboard] Auto-refresh triggered');
      loadUsageData(true);
    }, AUTO_REFRESH_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Update page title with next reset time
  useEffect(() => {
    if (usageViews.length === 0) return;

    // Find the earliest next reset time
    let earliestResetMs = 0;
    for (const view of usageViews) {
      if (view.nextResetTime) {
        const resetDate = new Date(view.nextResetTime);
        const now = new Date();
        const diffMs = resetDate.getTime() - now.getTime();
        if (diffMs > 0) {
          if (earliestResetMs === 0 || diffMs < earliestResetMs) {
            earliestResetMs = diffMs;
          }
        }
      }
    }

    if (earliestResetMs > 0) {
      const hours = Math.floor(earliestResetMs / (1000 * 60 * 60));
      const mins = Math.floor((earliestResetMs % (1000 * 60 * 60)) / (1000 * 60));
      if (hours > 0) {
        document.title = `AI Token Monitor - ${hours}h${mins}m 后刷新`;
      } else {
        document.title = `AI Token Monitor - ${mins}m 后刷新`;
      }
    } else {
      document.title = 'AI Token Monitor';
    }

    // Update title every minute
    const titleInterval = setInterval(() => {
      for (const view of usageViews) {
        if (view.nextResetTime) {
          const resetDate = new Date(view.nextResetTime);
          const now = new Date();
          const diffMs = resetDate.getTime() - now.getTime();
          if (diffMs > 0) {
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            if (hours > 0) {
              document.title = `AI Token Monitor - ${hours}h${mins}m 后刷新`;
            } else {
              document.title = `AI Token Monitor - ${mins}m 后刷新`;
            }
            break;
          }
        }
      }
    }, 60000);

    return () => clearInterval(titleInterval);
  }, [usageViews]);

  const loadUsageData = async (forceFetch = false) => {
    console.log('[Dashboard] loadUsageData called, forceFetch:', forceFetch, 'usageViews.length:', usageViews.length);
    try {
      setError(null);
      if (usageViews.length === 0) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      // First, fetch fresh data from APIs if forceFetch is true or no data exists
      if (forceFetch || usageViews.length === 0) {
        try {
          const accounts = await getAllPlatformAccounts();
          console.log('[Dashboard] Found accounts:', accounts.length, accounts.map(a => ({ id: a.id, platform: a.platformName, label: a.accountLabel })));
          if (accounts.length > 0) {
            const accountIds = accounts.map(a => a.id);
            console.log('[Dashboard] Fetching usage for:', accountIds);
            await fetchAllUsage(accountIds);
            console.log('[Dashboard] Fetch complete');
          }
        } catch (fetchErr) {
          console.error('[Dashboard] Failed to fetch usage:', fetchErr);
          // Continue to show cached data even if fetch fails
        }
      }

      const views = await aggregateAllUsage();
      setUsageViews(views);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败，请稍后重试');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    await loadUsageData(true); // Force fetch from API
  };

  // Render states
  if (isLoading) {
    return (
      <Dashboard>
        <LoadingSpinner size="lg" className="py-12" />
      </Dashboard>
    );
  }

  if (error && usageViews.length === 0) {
    return (
      <Dashboard>
        <ErrorMessage
          title="加载失败"
          message={error}
          onRetry={handleRefresh}
        />
      </Dashboard>
    );
  }

  // Empty state
  if (usageViews.length === 0) {
    return (
      <Dashboard>
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">暂无数据</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            请先在{' '}
            <a href="/credentials" className="text-blue-600 hover:text-blue-500">
              凭证管理
            </a>{' '}
            页面添加平台账号
          </p>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <SummaryView views={usageViews} />
        <RefreshButton loading={isRefreshing} onClick={handleRefresh} disabled={isRefreshing} />
      </div>

      {/* Error Alert (non-blocking) */}
      {error && (
        <div className="mb-6">
          <ErrorMessage
            title="部分数据加载失败"
            message={error}
            onRetry={handleRefresh}
            onDismiss={() => setError(null)}
          />
        </div>
      )}

      {/* Usage Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {usageViews.map((view) => (
          <UsageCard key={view.platformAccountId} usage={view} />
        ))}
      </div>
    </Dashboard>
  );
}

/**
 * Summary statistics view
 */
interface SummaryViewProps {
  views: CurrentUsageView[];
}

function SummaryView({ views }: SummaryViewProps) {
  const criticalCount = views.filter((v) => v.status === 'critical').length;
  const warningCount = views.filter((v) => v.status === 'warning').length;

  return (
    <div className="flex items-center gap-6 text-sm">
      <div className="text-gray-600 dark:text-gray-400">
        总计: <span className="font-semibold text-gray-900 dark:text-white">{views.length}</span> 个平台
      </div>
      {criticalCount > 0 && (
        <div className="text-red-600 dark:text-red-400">
          严重: <span className="font-semibold">{criticalCount}</span>
        </div>
      )}
      {warningCount > 0 && (
        <div className="text-yellow-600 dark:text-yellow-400">
          警告: <span className="font-semibold">{warningCount}</span>
        </div>
      )}
    </div>
  );
}
