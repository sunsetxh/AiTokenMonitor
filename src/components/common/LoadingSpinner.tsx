/**
 * Loading Spinner Component
 */

import { HTMLAttributes } from 'react';

interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4',
};

export function LoadingSpinner({ size = 'md', className = '', ...props }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`} {...props}>
      <div
        className={`${sizeStyles[size]} border-gray-200 border-t-blue-600 rounded-full animate-spin dark:border-gray-700 dark:border-t-blue-500`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

/**
 * Full page loading overlay
 */
export function LoadingOverlay({ message = '加载中...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
}
