/**
 * Usage Fetch Service
 * Orchestrates parallel fetching of usage data from all platforms
 */

import { UsageData } from '../../models/types';
import { getDecryptedCredential, getPlatformAccountById } from '../storage/storage-service';
import { getAdapter } from '../platform/registry';
import { PlatformType } from '@/models/types';
import { saveUsageRecord } from '../api/backend-api';

/**
 * Fetch usage data from all configured platforms
 * @param platformAccountIds - Array of platform account IDs to fetch from
 * @returns Map of platform account ID to UsageData
 */
export async function fetchAllUsage(
  platformAccountIds: string[]
): Promise<Map<string, UsageData>> {
  const results = new Map<string, UsageData>();

  // Fetch from all platforms in parallel
  const promises = platformAccountIds.map(async (platformAccountId) => {
    try {
      const usage = await fetchUsageForPlatform(platformAccountId);
      return { platformAccountId, usage, error: null };
    } catch (error) {
      console.error(`Failed to fetch usage for ${platformAccountId}:`, error);
      return {
        platformAccountId,
        usage: null,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  });

  const resultsArray = await Promise.all(promises);

  // Process results
  for (const result of resultsArray) {
    if (result.usage) {
      console.log('[fetchAllUsage] Got usage for', result.platformAccountId, ':', result.usage);
      results.set(result.platformAccountId, result.usage);

      // Save to database
      console.log('[fetchAllUsage] Saving to database:', result.usage);
      await saveUsageRecord({
        platformAccountId: result.platformAccountId,
        tokensUsed: result.usage.tokensUsed,
        tokensRemaining: result.usage.tokensRemaining,
        quotaTotal: result.usage.quotaTotal,
        timestamp: result.usage.timestamp,
        nextResetTime: result.usage.nextResetTime,
      });
      console.log('[fetchAllUsage] Saved to database for', result.platformAccountId);
    } else if (result.error) {
      console.log('[fetchAllUsage] Error for', result.platformAccountId, ':', result.error);
    }
  }

  return results;
}

/**
 * Fetch usage data for a single platform
 * @param platformAccountId - Platform account ID to fetch from
 * @returns UsageData
 * @throws {Error} - If fetch fails
 */
export async function fetchUsageForPlatform(platformAccountId: string): Promise<UsageData> {
  // Get the platform account to determine which adapter to use
  const account = await getPlatformAccountById(platformAccountId);
  if (!account) {
    throw new Error(`Platform account not found: ${platformAccountId}`);
  }

  // Get the correct adapter based on platform type
  const adapter = getAdapter(account.platformName as PlatformType);
  if (!adapter) {
    throw new Error(`Unsupported platform: ${account.platformName}`);
  }

  // Get decrypted credentials
  const credentials = await getDecryptedCredential(platformAccountId);

  console.log('[fetchUsageForPlatform] Credentials for', platformAccountId, ':', credentials ? `exists (${credentials.length} chars)` : 'NULL');

  if (!credentials) {
    throw new Error(`No credentials found for platform account ${platformAccountId}`);
  }

  // Validate credentials first
  const isValid = await adapter.validateCredentials(credentials);
  console.log('[fetchUsageForPlatform] validateCredentials result:', isValid, 'for', account.platformName);
  if (!isValid) {
    throw new Error(`Invalid credentials for platform account ${platformAccountId}`);
  }

  // Fetch usage
  console.log('[fetchUsageForPlatform] Calling adapter.fetchUsage for', platformAccountId, 'platform:', account.platformName);
  const usage = await adapter.fetchUsage(credentials);
  console.log('[fetchUsageForPlatform] Got usage:', usage);

  return usage;
}

/**
 * Fetch usage data for a single platform with retry
 * @param platformAccountId - Platform account ID to fetch from
 * @param maxRetries - Maximum number of retries (default: 3)
 * @returns UsageData
 */
export async function fetchUsageWithRetry(
  platformAccountId: string,
  maxRetries: number = 3
): Promise<UsageData> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fetchUsageForPlatform(platformAccountId);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on authentication errors
      if (lastError.message.includes('Invalid credentials') || lastError.message.includes('认证失败')) {
        throw lastError;
      }

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Failed to fetch usage after retries');
}

/**
 * Fetch usage for specific platforms only
 * @param platformAccountIds - Array of platform account IDs
 * @param maxRetries - Maximum retries per platform
 * @returns Map of platform account ID to UsageData or Error
 */
export async function fetchSpecificUsage(
  platformAccountIds: string[],
  maxRetries: number = 3
): Promise<Map<string, UsageData | Error>> {
  const results = new Map<string, UsageData | Error>();

  const promises = platformAccountIds.map(async (platformAccountId) => {
    try {
      const usage = await fetchUsageWithRetry(platformAccountId, maxRetries);
      return { platformAccountId, data: usage, error: null };
    } catch (error) {
      return {
        platformAccountId,
        data: null,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  });

  const resultsArray = await Promise.all(promises);

  for (const result of resultsArray) {
    if (result.error) {
      results.set(result.platformAccountId, result.error);
    } else if (result.data) {
      results.set(result.platformAccountId, result.data);
    }
  }

  return results;
}
