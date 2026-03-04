/**
 * Trend Stats Component
 * Summary statistics for usage trends
 */

import { TrendDataPoint } from '../../services/trends/trends-data';

interface TrendStatsProps {
  data: TrendDataPoint[];
}

export function TrendStats({ data }: TrendStatsProps) {
  // Calculate stats
  const totalUsage = data.reduce((sum, d) => sum + d.tokensUsed, 0);
  const avgUsage = data.length > 0 ? Math.round(totalUsage / data.length) : 0;
  const maxUsage = data.length > 0 ? Math.max(...data.map((d) => d.tokensUsed)) : 0;
  const minUsage = data.length > 0 ? Math.min(...data.map((d) => d.tokensUsed)) : 0;

  const stats = [
    { label: '总使用量', value: `${(totalUsage / 1000000).toFixed(2)}M`, tooltip: `${totalUsage.toLocaleString()} tokens` },
    { label: '日均', value: `${(avgUsage / 1000).toFixed(1)}k`, tooltip: `${avgUsage.toLocaleString()} tokens/天` },
    { label: '峰值', value: `${(maxUsage / 1000).toFixed(1)}k`, tooltip: `${maxUsage.toLocaleString()} tokens` },
    { label: '最低', value: `${(minUsage / 1000).toFixed(1)}k`, tooltip: `${minUsage.toLocaleString()} tokens` },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
          title={stat.tooltip}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
