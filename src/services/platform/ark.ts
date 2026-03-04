/**
 * Ark Platform Adapter
 * Implements PlatformAdapter for Ark API
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

export class ArkAdapter extends BasePlatformAdapter {
  readonly name: PlatformType = 'ark';

  getDisplayName(): string {
    return 'Ark (火山引擎)';
  }

  getLogoUrl(): string {
    return '/logos/ark.svg';
  }

  async validateCredentials(credentials: string): Promise<boolean> {
    if (!credentials || credentials.length < 10) {
      return false;
    }

    try {
      // Try to call Ark API to validate credentials
      const response = await this.fetchWithTimeout(
        'https://ark.cn-beijing.volces.com/api/v3/models',
        {
          headers: {
            'Authorization': `Bearer ${credentials}`,
            'Content-Type': 'application/json',
          },
        },
        10000
      );

      return response.ok;
    } catch {
      return false;
    }
  }

  async fetchUsage(credentials: string): Promise<UsageData> {
    try {
      // Fetch from Ark billing/usage API
      // Note: This is a placeholder - actual API endpoint needs verification
      const response = await this.fetchWithTimeout(
        'https://ark.cn-beijing.volces.com/api/v3/usage',
        {
          headers: {
            'Authorization': `Bearer ${credentials}`,
            'Content-Type': 'application/json',
          },
        },
        10000
      );

      if (response.status === 401 || response.status === 403) {
        throw new AuthenticationError(this.name);
      }

      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        throw new RateLimitError(this.name, retryAfter ? parseInt(retryAfter) : undefined);
      }

      if (!response.ok) {
        throw new NetworkError(this.name, new Error(`HTTP ${response.status}`));
      }

      const data = await response.json();

      // Parse response - structure depends on actual Ark API
      const tokensUsed = data.used_tokens ?? data.usage?.tokens_used ?? 0;
      const quotaTotal = data.quota_tokens ?? data.usage?.quota_total ?? 1000000;
      const tokensRemaining = quotaTotal - tokensUsed;

      return {
        tokensUsed,
        quotaTotal,
        tokensRemaining,
        timestamp: new Date().toISOString(),
        rawResponse: data,
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
    return 'monthly'; // Most cloud APIs reset monthly
  }

  getCredentialFormat(): CredentialFormat {
    return {
      type: 'bearer_token',
      label: 'API Key',
      placeholder: 'Ark API Key',
      description: '在 Ark 控制台获取 API Key',
      helpUrl: 'https://www.volcengine.com/docs/ark',
    };
  }

  async supportsDirectBrowserCall(): Promise<boolean> {
    // Most cloud APIs don't support CORS from browser
    return false;
  }
}

export const arkAdapter = new ArkAdapter();
