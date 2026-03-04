/**
 * Credential Validation Service
 * Validates API credentials for all platforms
 */

import { claudeAdapter } from '../platform/claude';
import { zaiAdapter } from '../platform/zai';
import { arkAdapter } from '../platform/ark';
import { minimaxAdapter } from '../platform/minimax';
import { getDecryptedCredential, updateCredentialStatus } from '../storage/storage-service';
import { PlatformAdapter, PlatformType } from '@/models/types';

// Map of platform adapters
const adapters: Record<PlatformType, PlatformAdapter> = {
  claude: claudeAdapter,
  zai: zaiAdapter,
  ark: arkAdapter,
  minimax: minimaxAdapter,
};

/**
 * Validate credentials for a specific platform account
 * @param platformAccountId - Platform account ID
 * @param platformType - Platform type
 * @returns Promise<boolean> - true if valid
 */
export async function validateCredential(
  platformAccountId: string,
  platformType: string
): Promise<boolean> {
  try {
    // Get decrypted credentials
    const credentials = await getDecryptedCredential(platformAccountId);

    if (!credentials) {
      await updateCredentialStatus(platformAccountId, 'invalid');
      return false;
    }

    // Get the adapter for this platform
    const adapter = adapters[platformType as PlatformType];

    if (!adapter) {
      console.warn(`Unknown platform type: ${platformType}`);
      await updateCredentialStatus(platformAccountId, 'invalid');
      return false;
    }

    // Validate using the adapter
    let isValid = false;
    try {
      isValid = await adapter.validateCredentials(credentials);
    } catch (error) {
      console.error(`Validation error for ${platformType}:`, error);
      isValid = false;
    }

    // Update status
    await updateCredentialStatus(
      platformAccountId,
      isValid ? 'valid' : 'invalid'
    );

    return isValid;
  } catch (error) {
    console.error('Credential validation error:', error);
    await updateCredentialStatus(platformAccountId, 'invalid');
    return false;
  }
}

/**
 * Validate all credentials
 * @returns Map of platform account ID to validation result
 */
export async function validateAllCredentials(): Promise<Map<string, boolean>> {
  const { getAllPlatformAccounts, getCredentialData } = await import('../storage/storage-service');

  const accounts = await getAllPlatformAccounts();
  const results = new Map<string, boolean>();

  // Validate in parallel
  const promises = accounts.map(async (account) => {
    const credential = await getCredentialData(account.id);
    if (credential) {
      const isValid = await validateCredential(account.id, account.platformName);
      results.set(account.id, isValid);
    }
  });

  await Promise.all(promises);

  return results;
}
