/**
 * Trends Page
 * Historical usage trends with filtering
 */

import { useState, useEffect } from 'react';
import { UsageChart } from './UsageChart';
import { PlatformFilter } from './PlatformFilter';
import { DateRangePicker } from './DateRangePicker';
import { TrendStats } from './TrendStats';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { getTrendsData, TrendDataPoint } from '../../services/trends/trends-data';

type DatePreset = '7d' | '14d' | '30d' | '90d';

export function TrendsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [datePreset, setDatePreset] = useState<DatePreset>('7d');

  useEffect(() => {
    loadTrendsData();
  }, [selectedPlatforms, datePreset]);

  const loadTrendsData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Calculate date range
      const days = datePreset === '7d' ? 7 : datePreset === '14d' ? 14 : datePreset === '30d' ? 30 : 90;
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const data = await getTrendsData(startDate, endDate, selectedPlatforms);
      setTrendData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">使用趋势</h2>
        <LoadingSpinner size="lg" className="py-12" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">使用趋势</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <PlatformFilter
          selected={selectedPlatforms}
          onChange={setSelectedPlatforms}
        />
        <DateRangePicker
          value={datePreset}
          onChange={setDatePreset}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6">
          <ErrorMessage
            title="加载失败"
            message={error}
            onRetry={loadTrendsData}
          />
        </div>
      )}

      {/* Stats */}
      <div className="mb-6">
        <TrendStats data={trendData} />
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Token 使用量趋势
        </h3>
        {trendData.length > 0 ? (
          <UsageChart data={trendData} />
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            暂无数据，请先添加平台凭证并等待数据收集
          </div>
        )}
      </div>
    </div>
  );
}
