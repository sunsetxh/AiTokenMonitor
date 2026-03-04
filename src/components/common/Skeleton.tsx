/**
 * Loading Skeleton Component
 * Displays placeholder content while data is loading
 */

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse'
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  };

  const style: React.CSSProperties = {
    width: width ?? '100%',
    height: height ?? (variant === 'text' ? '1em' : '100%')
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
}

/**
 * Card skeleton for dashboard
 */
export function UsageCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={20} />
          <Skeleton width="40%" height={14} />
        </div>
      </div>
      <Skeleton height={8} />
      <div className="flex justify-between">
        <Skeleton width="30%" height={14} />
        <Skeleton width="20%" height={14} />
      </div>
    </div>
  );
}

/**
 * List skeleton for credentials
 */
export function CredentialCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={36} height={36} />
        <div className="flex-1">
          <Skeleton width="50%" height={18} />
          <Skeleton width="30%" height={14} className="mt-1" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton width={60} height={28} />
        <Skeleton width={60} height={28} />
      </div>
    </div>
  );
}

/**
 * Chart skeleton for trends
 */
export function ChartSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
      <div className="flex justify-between">
        <Skeleton width={120} height={24} />
        <Skeleton width={100} height={32} />
      </div>
      <Skeleton height={200} />
      <div className="flex justify-between">
        <Skeleton width="30%" height={16} />
        <Skeleton width="30%" height={16} />
        <Skeleton width="30%" height={16} />
      </div>
    </div>
  );
}

/**
 * Page skeleton
 */
export function PageSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton height={40} width={200} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <UsageCardSkeleton />
        <UsageCardSkeleton />
        <UsageCardSkeleton />
      </div>
    </div>
  );
}
