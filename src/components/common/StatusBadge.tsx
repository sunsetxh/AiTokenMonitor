/**
 * Status Badge Component
 * Visual indicator for usage status (normal/warning/critical)
 */

import { UsageStatus } from '../../models/types';

interface StatusBadgeProps {
  status: UsageStatus;
  size?: 'sm' | 'md';
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

const statusConfig = {
  normal: {
    label: '正常',
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    dotColor: 'bg-green-500',
  },
  warning: {
    label: '警告',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    dotColor: 'bg-yellow-500',
  },
  critical: {
    label: '严重',
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    dotColor: 'bg-red-500',
  },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full ${sizeStyles[size]} ${config.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      <span className="font-medium">{config.label}</span>
    </div>
  );
}
