/**
 * Auto-refresh polling service
 * Manages periodic data refresh for the dashboard
 */

import { fetchAllUsage } from './usage-fetcher';

export interface AutoRefreshOptions {
  interval: number; // milliseconds
  enabled: boolean;
  onRefresh?: (error: Error | null) => void;
}

class AutoRefreshService {
  private intervalId: number | null = null;
  private options: AutoRefreshOptions = {
    interval: 5 * 60 * 60 * 1000, // 5 hours default
    enabled: true,
  };

  constructor(options?: Partial<AutoRefreshOptions>) {
    if (options) {
      this.options = { ...this.options, ...options };
    }
  }

  /**
   * Start auto-refresh
   * @param platformAccountIds - Platform account IDs to refresh
   */
  start(platformAccountIds: string[]): void {
    if (!this.options.enabled) {
      return;
    }

    this.stop(); // Clear any existing interval

    this.intervalId = window.setInterval(async () => {
      try {
        await fetchAllUsage(platformAccountIds);
        this.options.onRefresh?.(null);
      } catch (error) {
        console.error('Auto-refresh failed:', error);
        this.options.onRefresh?.(error instanceof Error ? error : new Error(String(error)));
      }
    }, this.options.interval);
  }

  /**
   * Stop auto-refresh
   */
  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Update options
   */
  updateOptions(options: Partial<AutoRefreshOptions>): void {
    const wasRunning = this.intervalId !== null;

    if (wasRunning) {
      this.stop();
    }

    this.options = { ...this.options, ...options };

    if (wasRunning && this.options.enabled) {
      // Need to restart with new options, but we need the platformAccountIds
      // This is handled by the component managing the service
    }
  }

  /**
   * Check if currently running
   */
  isRunning(): boolean {
    return this.intervalId !== null;
  }

  /**
   * Get current options
   */
  getOptions(): AutoRefreshOptions {
    return { ...this.options };
  }
}

// Export factory function
export function createAutoRefreshService(options?: Partial<AutoRefreshOptions>): AutoRefreshService {
  return new AutoRefreshService(options);
}

// Export default singleton
export const autoRefreshService = new AutoRefreshService();

/**
 * Get refresh interval from environment
 * Default: 5 hours for all platforms
 */
export function getRefreshInterval(): number {
  const envInterval = import.meta.env.VITE_FETCH_INTERVAL;
  if (envInterval) {
    const parsed = parseInt(envInterval, 10);
    if (!isNaN(parsed) && parsed >= 60000) {
      return parsed;
    }
  }
  return 5 * 60 * 60 * 1000; // Default 5 hours
}

/**
 * Validate refresh interval (5 minutes to 24 hours)
 */
export function validateRefreshInterval(interval: number): boolean {
  return interval >= 300000 && interval <= 86400000;
}
