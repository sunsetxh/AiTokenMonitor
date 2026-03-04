/**
 * Date and time utility functions
 */

/**
 * Format a timestamp to a human-readable string
 * @param timestamp - ISO 8601 timestamp
 * @param format - Format style: 'full', 'short', 'time', 'date'
 * @returns Formatted string
 */
export function formatTimestamp(
  timestamp: string,
  format: 'full' | 'short' | 'time' | 'date' | 'relative' = 'short'
): string {
  const date = new Date(timestamp);

  if (format === 'relative') {
    return formatRelativeTime(date);
  }

  const optionsMap: Record<string, Intl.DateTimeFormatOptions> = {
    full: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    },
    short: {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
    time: {
      hour: '2-digit',
      minute: '2-digit',
    },
    date: {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    },
  };

  return new Intl.DateTimeFormat('zh-CN', optionsMap[format]).format(date);
}

/**
 * Calculate how fresh data is (seconds since last update)
 * @param timestamp - ISO 8601 timestamp of last update
 * @returns Seconds since last update
 */
export function calculateDataFreshness(timestamp: string): number {
  const now = Date.now();
  const lastUpdate = new Date(timestamp).getTime();
  return Math.floor((now - lastUpdate) / 1000);
}

/**
 * Check if data is stale (older than specified threshold)
 * @param timestamp - ISO 8601 timestamp to check
 * @param thresholdSeconds - Threshold in seconds (default: 300 = 5 minutes)
 * @returns true if data is stale
 */
export function isStale(timestamp: string, thresholdSeconds: number = 300): boolean {
  const freshness = calculateDataFreshness(timestamp);
  return freshness > thresholdSeconds;
}

/**
 * Format relative time (e.g., "2 minutes ago", "1 hour ago")
 * @param date - Date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return '刚刚';
  } else if (diffMins < 60) {
    return `${diffMins}分钟前`;
  } else if (diffHours < 24) {
    return `${diffHours}小时前`;
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else {
    return formatTimestamp(date.toISOString(), 'date');
  }
}

/**
 * Format freshness duration for display
 * @param seconds - Seconds to format
 * @returns Formatted string (e.g., "2分钟", "1小时")
 */
export function formatFreshness(seconds: number): string {
  // Handle negative or zero values
  if (seconds <= 0) {
    return '刚刚';
  }
  if (seconds < 60) {
    return `${seconds}秒`;
  } else if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    return `${mins}分钟`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours}小时`;
  } else {
    const days = Math.floor(seconds / 86400);
    return `${days}天`;
  }
}

/**
 * Get start and end of day for a given date
 * @param date - Date to get day bounds for
 * @returns Object with start and end timestamps
 */
export function getDayBounds(date: Date = new Date()): { start: string; end: string } {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

/**
 * Get start and end of month for a given date
 * @param date - Date to get month bounds for
 * @returns Object with start and end timestamps
 */
export function getMonthBounds(date: Date = new Date()): { start: string; end: string } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

/**
 * Get date range for the last N days
 * @param days - Number of days to look back
 * @param endDate - Optional end date (default: now)
 * @returns Object with start and end timestamps
 */
export function getDateRangeLastNDays(days: number, endDate: Date = new Date()): { start: string; end: string } {
  const start = new Date(endDate);
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

/**
 * Check if a date is today
 * @param timestamp - ISO 8601 timestamp
 * @returns true if the date is today
 */
export function isToday(timestamp: string): boolean {
  const date = new Date(timestamp);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date is within the last N days
 * @param timestamp - ISO 8601 timestamp
 * @param days - Number of days to check
 * @returns true if within the last N days
 */
export function isWithinLastNDays(timestamp: string, days: number): boolean {
  const date = new Date(timestamp);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return date >= cutoff;
}
