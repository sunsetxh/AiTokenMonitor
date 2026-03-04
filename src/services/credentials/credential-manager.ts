/**
 * Credential Manager Service
 * Uses backend API for credential storage
 */

import * as backendApi from '../api/backend-api';
import { DEFAULT_WARNING_PERCENT, DEFAULT_CRITICAL_PERCENT } from '../../models/ThresholdConfig';
import { PlatformType } from '@/models/types';

/**
 * Add a new platform account with credentials
 */
export async function addPlatformWithCredentials(
  platformName: string,
  accountLabel: string,
  limitType: string,
  credentials: string
): Promise<{ accountId: string; credentialId: string }> {
  // Add credential to backend
  const result = await backendApi.addCredential({
    platform: platformName,
    label: accountLabel,
    credential: credentials,
    limitType,
  });

  // Create default threshold config
  await backendApi.saveThresholdConfig(result.id, {
    warningPercent: DEFAULT_WARNING_PERCENT,
    criticalPercent: DEFAULT_CRITICAL_PERCENT,
    notificationsEnabled: true,
  });

  return { accountId: result.id, credentialId: result.id };
}

/**
 * Get all platform accounts with status
 */
export async function getAccountsWithStatus() {
  const credentials = await backendApi.getCredentials();

  return credentials.map(cred => ({
    id: cred.id,
    platformName: cred.platform as PlatformType,
    accountLabel: cred.label,
    limitType: cred.limitType,
    createdAt: cred.createdAt,
    status: 'valid' as const,
  }));
}

/**
 * Get decrypted credential for an account
 */
export async function getDecryptedCredential(platformAccountId: string): Promise<string | null> {
  try {
    const result = await backendApi.getCredential(platformAccountId);
    return result.credential;
  } catch {
    return null;
  }
}

/**
 * Delete a platform account and its credentials
 */
export async function deletePlatformWithCredentials(platformAccountId: string): Promise<void> {
  await backendApi.deleteCredential(platformAccountId);
}

/**
 * Update credential for an account
 */
export async function updateCredential(platformAccountId: string, credentials: string): Promise<void> {
  await backendApi.updateCredential(platformAccountId, { credential: credentials });
}
