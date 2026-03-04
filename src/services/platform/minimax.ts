/**
 * MiniMax Platform Adapter
 * Implements PlatformAdapter for MiniMax API
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

export class MiniMaxAdapter extends BasePlatformAdapter {
  readonly name: PlatformType = 'minimax';

  // Use proxy server (through Vite dev server proxy)
  private readonly baseUrl = '/api/minimax';

  getDisplayName(): string {
    return 'MiniMax';
  }

  getLogoUrl(): string {
    return '/logos/minimax.svg';
  }

  private getEndpoints() {
    return {
      quotaRemains: `${this.baseUrl}/v1/api/openplatform/coding_plan/remains`,
    };
  }

  async validateCredentials(credentials: string): Promise<boolean> {
    if (!credentials || credentials.length < 10) {
      return false;
    }

    try {
      const { quotaRemains } = this.getEndpoints();
      const response = await this.fetchWithTimeout(
        quotaRemains,
        {
          headers: {
            'Authorization': `Bearer ${credentials}`,
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
      const { quotaRemains } = this.getEndpoints();

      const response = await this.fetchWithTimeout(
        quotaRemains,
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

      if (data.base_resp?.status_code !== 0) {
        throw new NetworkError(this.name, new Error(data.base_resp?.status_msg || 'API request failed'));
      }

      // Parse MiniMax response
      // Response format: { model_remains: [{ current_interval_total_count, current_interval_usage_count, end_time, ... }] }
      const modelRemains = data.model_remains || [];
      const firstModel = modelRemains[0];

      if (!firstModel) {
        throw new NetworkError(this.name, new Error('No usage data returned'));
      }

      const quotaTotal = firstModel.current_interval_total_count || 1500;
      // API returns remaining count as current_interval_usage_count, not used count
      const tokensRemaining = firstModel.current_interval_usage_count || 0;
      const tokensUsed = quotaTotal - tokensRemaining;

      // Get next reset time from end_time (timestamp in milliseconds)
      let nextResetTime: string | undefined;
      if (firstModel.end_time) {
        nextResetTime = new Date(firstModel.end_time).toISOString();
      }

      return {
        tokensUsed,
        quotaTotal,
        tokensRemaining,
        timestamp: new Date().toISOString(),
        nextResetTime,
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
    return 'monthly';
  }

  getCredentialFormat(): CredentialFormat {
    return {
      type: 'api_key',
      label: 'API Key',
      placeholder: 'your-api-key',
      additionalFields: [
        {
          key: 'group_id',
          label: 'Group ID',
          placeholder: 'Group ID (可选)',
          required: false,
        },
      ],
      description: '在 MiniMax 控制台获取 API Key',
      helpUrl: 'https://platform.minimax.chat/docs',
    };
  }

  async supportsDirectBrowserCall(): Promise<boolean> {
    return false;
  }
}

export const minimaxAdapter = new MiniMaxAdapter();
