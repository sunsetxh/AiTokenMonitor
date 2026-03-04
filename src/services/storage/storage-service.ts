/**
 * Storage Service
 * Wraps backend API for storage operations
 */

import * as backendApi from '../api/backend-api';
import { PlatformType } from '@/models/types';

export interface PlatformAccount {
  id: string;
  platformName: string;
  accountLabel: string;
  limitType: string;
  createdAt: string;
  updatedAt: string;
}

// ============ Platform Account (Credentials) ============

export async function getAllPlatformAccounts(): Promise<PlatformAccount[]> {
  const credentials = await backendApi.getCredentials();
  return credentials.map(cred => ({
    id: cred.id,
    platformName: cred.platform as PlatformType,
    accountLabel: cred.label,
    limitType: cred.limitType,
    createdAt: cred.createdAt,
    updatedAt: cred.updatedAt,
  }));
}

export async function getPlatformAccountById(id: string): Promise<PlatformAccount | null> {
  const credentials = await backendApi.getCredentials();
  const cred = credentials.find(c => c.id === id);
  if (!cred) return null;
  return {
    id: cred.id,
    platformName: cred.platform as PlatformType,
    accountLabel: cred.label,
    limitType: cred.limitType,
    createdAt: cred.createdAt,
    updatedAt: cred.updatedAt,
  };
}

export async function createPlatformAccount(
  account: Omit<PlatformAccount, 'id' | 'createdAt' | 'updatedAt'>
): Promise<PlatformAccount> {
  const result = await backendApi.addCredential({
    platform: account.platformName,
    label: account.accountLabel,
    credential: '', // Will be set separately
    limitType: account.limitType,
  });
  return {
    id: result.id,
    platformName: account.platformName,
    accountLabel: account.accountLabel,
    limitType: account.limitType,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function deletePlatformAccount(id: string): Promise<void> {
  await backendApi.deleteCredential(id);
}

// ============ Credential Data ============

export async function getDecryptedCredential(platformAccountId: string): Promise<string | null> {
  try {
    const result = await backendApi.getCredential(platformAccountId);
    return result.credential;
  } catch {
    return null;
  }
}

export async function createCredentialData(_data: { platformAccountId: string; platformType: string; encryptedValue: string }) {
  // Not needed - credentials stored via addCredential
}

export async function updateCredentialData(platformAccountId: string, data: { encryptedValue?: string }) {
  if (data.encryptedValue) {
    await backendApi.updateCredential(platformAccountId, { credential: data.encryptedValue });
  }
}

export async function updateCredentialStatus(_platformAccountId: string, _status: string) {
  // Not needed - status is not stored
}

export async function getCredentialData(platformAccountId: string) {
  // Return decrypted credential
  return getDecryptedCredential(platformAccountId);
}

export async function exportData(): Promise<ExportData> {
  return exportAllData();
}

export async function clearAll(): Promise<void> {
  await deleteAllData();
}

export async function clearAllData(): Promise<void> {
  await deleteAllData();
}

// ============ Usage Records ============

export async function createUsageRecord(record: {
  platformAccountId: string;
  tokensUsed: number;
  tokensRemaining: number;
  quotaTotal: number;
  timestamp: string;
  nextResetTime?: string;
}) {
  await backendApi.saveUsageRecord(record);
}

export async function createUsageRecords(
  records: Array<{
    platformAccountId: string;
    tokensUsed: number;
    tokensRemaining: number;
    quotaTotal: number;
    timestamp: string;
    nextResetTime?: string;
  }>
) {
  for (const record of records) {
    await backendApi.saveUsageRecord(record);
  }
}

export async function getLatestUsageRecord(platformAccountId: string) {
  const records = await backendApi.getUsageRecords(platformAccountId);
  return records[0] || null;
}

export async function getUsageRecordsByTimeRange(
  platformAccountId: string,
  startTime: Date,
  endTime: Date
) {
  const records = await backendApi.getUsageRecords(platformAccountId);
  return records.filter(r => {
    const ts = new Date(r.timestamp).getTime();
    return ts >= startTime.getTime() && ts <= endTime.getTime();
  });
}

export async function getAllLatestUsageRecords() {
  return backendApi.getLatestUsage();
}

// ============ Threshold Config ============

export async function getThresholdConfig(platformAccountId: string) {
  const config = await backendApi.getThresholdConfig(platformAccountId);
  if (!config) return null;
  return {
    platformAccountId,
    warningPercent: config.warningPercent,
    criticalPercent: config.criticalPercent,
    notificationsEnabled: config.notificationsEnabled,
    updatedAt: new Date().toISOString(),
  };
}

export async function createThresholdConfig(data: {
  platformAccountId: string;
  warningPercent: number;
  criticalPercent: number;
  notificationsEnabled: boolean;
}) {
  await backendApi.saveThresholdConfig(data.platformAccountId, {
    warningPercent: data.warningPercent,
    criticalPercent: data.criticalPercent,
    notificationsEnabled: data.notificationsEnabled,
  });
}

export async function updateThresholdConfig(platformAccountId: string, data: { warningPercent?: number; criticalPercent?: number }) {
  const existing = await backendApi.getThresholdConfig(platformAccountId);
  await backendApi.saveThresholdConfig(platformAccountId, {
    warningPercent: data.warningPercent ?? existing?.warningPercent ?? 70,
    criticalPercent: data.criticalPercent ?? existing?.criticalPercent ?? 90,
    notificationsEnabled: existing?.notificationsEnabled ?? true,
  });
}

// ============ Cleanup ============

export async function cleanupOldUsageRecords(_retentionDays: number): Promise<number> {
  // Not implemented in backend
  return 0;
}

export async function deleteAllData(): Promise<void> {
  const credentials = await backendApi.getCredentials();
  for (const cred of credentials) {
    await backendApi.deleteCredential(cred.id);
  }
}

// ============ Import/Export ============

export interface ExportData {
  platformAccounts: PlatformAccount[];
  usageRecords: any[];
  thresholdConfigs: any[];
  version: string;
}

export async function exportAllData(): Promise<ExportData> {
  const accounts = await getAllPlatformAccounts();
  const usageRecords: any[] = [];
  const thresholdConfigs: any[] = [];

  for (const account of accounts) {
    const records = await backendApi.getUsageRecords(account.id);
    usageRecords.push(...records);
    const threshold = await backendApi.getThresholdConfig(account.id);
    if (threshold) {
      thresholdConfigs.push({ platformAccountId: account.id, ...threshold });
    }
  }

  return {
    platformAccounts: accounts,
    usageRecords,
    thresholdConfigs,
    version: '1.0',
  };
}

export async function importData(_data: ExportData): Promise<void> {
  // Not implemented
}

export async function getStorageStats() {
  const accounts = await backendApi.getCredentials();
  let usageRecordsCount = 0;

  for (const account of accounts) {
    const records = await backendApi.getUsageRecords(account.id);
    usageRecordsCount += records.length;
  }

  return {
    platformAccountsCount: accounts.length,
    usageRecordsCount,
    thresholdConfigsCount: accounts.length,
  };
}
