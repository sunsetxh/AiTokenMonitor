/**
 * Mock Claude platform adapter
 * For MVP development - returns mock data
 * TODO: Replace with real Anthropic API integration
 */

import { BasePlatformAdapter } from './base';
import {
  PlatformType,
  LimitType,
  CredentialFormat,
  UsageData,
} from '../../models/types';

export class ClaudeAdapter extends BasePlatformAdapter {
  readonly name: PlatformType = 'claude';

  getDisplayName(): string {
    return 'Claude (Anthropic)';
  }

  getLogoUrl(): string {
    return '/logos/claude.svg';
  }

  async validateCredentials(_credentials: string): Promise<boolean> {
    // Mock validation - accept any key that starts with "sk-ant-"
    return _credentials.startsWith('sk-ant-');
  }

  async fetchUsage(_credentials: string): Promise<UsageData> {
    // Mock implementation - return simulated data
    // In production, this would call Anthropic's API

    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

    // Generate mock data
    const quotaTotal = 1000000; // 1M tokens per month
    const tokensUsed = Math.floor(Math.random() * quotaTotal * 0.8); // 0-80% used
    const tokensRemaining = quotaTotal - tokensUsed;

    return {
      tokensUsed,
      quotaTotal,
      tokensRemaining,
      timestamp: new Date().toISOString(),
      rawResponse: { mock: true },
    };
  }

  getLimitType(): LimitType {
    return 'monthly'; // Claude API resets monthly
  }

  getCredentialFormat(): CredentialFormat {
    return {
      type: 'api_key',
      label: 'API Key',
      placeholder: 'sk-ant-api03-...',
      description:
        '在 Anthropic Console 获取 API Key。格式: sk-ant-api03-...',
      helpUrl: 'https://docs.anthropic.com/claude/reference/getting-started-with-the-api',
    };
  }

  async supportsDirectBrowserCall(): Promise<boolean> {
    // TODO: Check if Anthropic API supports CORS
    // For now, return false (will need proxy or backend)
    return false;
  }
}

// Export singleton instance
export const claudeAdapter = new ClaudeAdapter();
