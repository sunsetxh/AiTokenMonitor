/**
 * Zai Platform Adapter
 * Implements PlatformAdapter for Zai API
 * API Docs: https://github.com/zai-org/zai-coding-plugins
 */

import { BasePlatformAdapter } from './base';
import {
  PlatformType,
  LimitType,
  CredentialFormat,
  UsageData,
  AuthenticationError,
  NetworkError,
  RateLimitError,
} from '../../models/types';

export class ZaiAdapter extends BasePlatformAdapter {
  readonly name: PlatformType = 'zai';

  // Use proxy server (through Vite dev server proxy)
  private readonly baseUrl = '/api/zai';

  getDisplayName(): string {
    return 'Zai';
  }

  getLogoUrl(): string {
    return '/logos/zai.svg';
  }

  private getEndpoints() {
    return {
      modelUsage: `${this.baseUrl}/api/monitor/usage/model-usage`,
      quotaLimit: `${this.baseUrl}/api/monitor/usage/quota/limit`,
    };
  }

  async validateCredentials(credentials: string): Promise<boolean> {
    // Skip validation for Zai - API calls will fail with CORS from browser
    // We'll validate when fetching usage instead
    return credentials.length > 0;
  }

  async fetchUsage(credentials: string): Promise<UsageData> {
    try {
      const { quotaLimit } = this.getEndpoints();

      // Get quota info
      const quotaResponse = await this.fetchWithTimeout(
        quotaLimit,
        {
          headers: {
            'Authorization': credentials,
            'Accept-Language': 'en-US,en',
            'Content-Type': 'application/json',
          },
        },
        10000
      );

      if (quotaResponse.status === 401 || quotaResponse.status === 403) {
        throw new AuthenticationError(this.name);
      }

      if (quotaResponse.status === 429) {
        const retryAfter = quotaResponse.headers.get('Retry-After');
        throw new RateLimitError(this.name, retryAfter ? parseInt(retryAfter) : undefined);
      }

      if (!quotaResponse.ok) {
        throw new NetworkError(this.name, new Error(`HTTP ${quotaResponse.status}`));
      }

      const quotaData = await quotaResponse.json();

      if (!quotaData.success) {
        throw new NetworkError(this.name, new Error(quotaData.msg || 'API request failed'));
      }

      // Parse quota data
      // Response format: { code: 200, data: { limits: [{ type: "TOKENS_LIMIT", number: 5, percentage: 0, ... }] } }
      const limits = quotaData.data?.limits || [];
      const tokensLimit = limits.find((l: { type: string }) => l.type === 'TOKENS_LIMIT');

      // Calculate total quota (unit 3 = millions)
      let quotaTotal = 5000000; // default 5M
      if (tokensLimit) {
        const unit = tokensLimit.unit || 3; // 3 = millions
        const number = tokensLimit.number || 5;
        if (unit === 3) {
          quotaTotal = number * 1000000;
        }
      }

      // Calculate used tokens from percentage
      let tokensUsed = 0;
      if (tokensLimit?.percentage !== undefined) {
        tokensUsed = Math.floor(quotaTotal * (tokensLimit.percentage / 100));
      }

      const tokensRemaining = quotaTotal - tokensUsed;

      // Get next reset time - use TOKENS_LIMIT, not TIME_LIMIT
      let nextResetTime: string | undefined;
      if (tokensLimit?.nextResetTime) {
        nextResetTime = new Date(tokensLimit.nextResetTime).toISOString();
      }

      return {
        tokensUsed,
        quotaTotal,
        tokensRemaining,
        timestamp: new Date().toISOString(),
        nextResetTime,
        rawResponse: quotaData,
      };
    } catch (error) {
      if (error instanceof AuthenticationError ||
          error instanceof NetworkError ||
          error instanceof RateLimitError) {
        throw error;
      }
      throw new NetworkError(this.name, error as Error);
    }
  }

  getLimitType(): LimitType {
    return 'monthly';
  }

  getCredentialFormat(): CredentialFormat {
    return {
      type: 'bearer_token',
      label: 'API Key',
      placeholder: 'Zai API Key',
      description: '在 Zai 控制台获取 API Key',
      helpUrl: 'https://docs.z.ai',
    };
  }

  async supportsDirectBrowserCall(): Promise<boolean> {
    return false;
  }
}

export const zaiAdapter = new ZaiAdapter();
