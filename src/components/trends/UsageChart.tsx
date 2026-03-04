/**
 * Usage Chart Component
 * Line chart for usage over time
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendDataPoint } from '../../services/trends/trends-data';
import { formatTimestamp } from '../../utils/date';

interface UsageChartProps {
  data: TrendDataPoint[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function UsageChart({ data }: UsageChartProps) {
  // Get unique platforms from data
  const platforms = [...new Set(data.map((d) => d.platformName))];

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => formatTimestamp(value, 'short')}
            className="text-xs fill-gray-500 dark:fill-gray-400"
          />
          <YAxis
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            className="text-xs fill-gray-500 dark:fill-gray-400"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg, #fff)',
              border: '1px solid var(--tooltip-border, #e5e7eb)',
              borderRadius: '8px',
            }}
            labelFormatter={(label) => formatTimestamp(label, 'full')}
            formatter={(value: number) => [`${value.toLocaleString()} tokens`, '使用量']}
          />
          <Legend />
          {platforms.map((platform, index) => (
            <Line
              key={platform}
              type="monotone"
              dataKey={platform}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
