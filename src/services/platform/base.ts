/**
 * Base platform adapter interface and abstract class
 * All platform implementations must extend this class
 */

import {
  PlatformType,
  LimitType,
  CredentialFormat,
  UsageData,
} from '../../models/types';

/**
 * Base abstract class for platform adapters
 * Provides common functionality and defines the contract for all platform integrations
 */
export abstract class BasePlatformAdapter {
  /**
   * Platform name (unique identifier)
   */
  abstract readonly name: PlatformType;

  /**
   * Get the display name for the platform (shown in UI)
   */
  abstract getDisplayName(): string;

  /**
   * Get the URL to the platform's logo
   */
  abstract getLogoUrl(): string;

  /**
   * Validate API credentials
   * @param credentials - The API credential (decrypted) to validate
   * @returns Promise<boolean> - true if valid, false if invalid
   */
  abstract validateCredentials(credentials: string): Promise<boolean>;

  /**
   * Fetch current token usage data
   * @param credentials - The API credential (decrypted) to use for the request
   * @returns Promise<UsageData> - Current usage information
   * @throws {AuthenticationError} - If credentials are invalid
   * @throws {NetworkError} - If network request fails
   * @throws {RateLimitError} - If rate limit is exceeded
   * @throws {ParseError} - If response cannot be parsed
   */
  abstract fetchUsage(credentials: string): Promise<UsageData>;

  /**
   * Get the limit type for this platform (daily, monthly, cumulative)
   */
  abstract getLimitType(): LimitType;

  /**
   * Get the credential format for UI display
   */
  abstract getCredentialFormat(): CredentialFormat;

  /**
   * Check if this platform supports direct browser calls (CORS)
   * @returns Promise<boolean> - true if browser can call API directly
   */
  abstract supportsDirectBrowserCall(): Promise<boolean>;

  /**
   * Get base API URL for the platform
   * Override in subclass if needed
   */
  protected getBaseUrl(): string {
    return '';
  }

  /**
   * Make a fetch request with common error handling
   * Helper method for subclasses
   */
  protected async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout: number = 10000
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      return response;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

/**
 * Platform registry for managing all platform adapters
 */
export class PlatformRegistry {
  private static adapters: Map<PlatformType, BasePlatformAdapter> = new Map();

  /**
   * Register a platform adapter
   */
  static register(adapter: BasePlatformAdapter): void {
    this.adapters.set(adapter.name, adapter);
  }

  /**
   * Get a platform adapter by type
   */
  static get(platformType: PlatformType): BasePlatformAdapter | undefined {
    return this.adapters.get(platformType);
  }

  /**
   * Get all registered adapters
   */
  static getAll(): BasePlatformAdapter[] {
    return Array.from(this.adapters.values());
  }

  /**
   * Get all supported platform types
   */
  static getSupportedPlatforms(): PlatformType[] {
    return Array.from(this.adapters.keys());
  }
}
