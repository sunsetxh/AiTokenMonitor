/**
 * Dashboard Component Shell
 * Main container for the dashboard view
 */

import { ReactNode } from 'react';

interface DashboardProps {
  children?: ReactNode;
}

export function Dashboard({ children }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Token 使用量监控</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            实时监控各平台的 API Token 使用情况
          </p>
        </div>
      </div>

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}
