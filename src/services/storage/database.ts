import Dexie, { Table } from 'dexie';

/**
 * Database entity interfaces
 */
export interface PlatformAccount {
  id: string;
  platformName: string;
  accountLabel: string;
  limitType: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsageRecord {
  id: string;
  platformAccountId: string;
  tokensUsed: number;
  tokensRemaining: number;
  quotaTotal: number;
  timestamp: string;
  nextResetTime?: string;
}

export interface ThresholdConfig {
  id: string;
  platformAccountId: string;
  warningPercent: number;
  criticalPercent: number;
  notificationsEnabled: boolean;
  updatedAt: string;
}

export interface CredentialData {
  id: string;
  platformAccountId: string;
  platformType: string;
  encryptedValue: string;
  validityStatus: string;
  lastValidated: string | null;
  createdAt: string;
}

/**
 * Dexie database class for Token Monitor
 */
class TokenMonitorDatabase extends Dexie {
  platformAccounts!: Table<PlatformAccount>;
  usageRecords!: Table<UsageRecord>;
  thresholdConfigs!: Table<ThresholdConfig>;
  credentialData!: Table<CredentialData>;

  constructor() {
    super('TokenMonitorDB');
    this.version(1).stores({
      platformAccounts: 'id, platformName, [platformName+accountLabel]',
      usageRecords: 'id, platformAccountId, [platformAccountId+timestamp], timestamp',
      thresholdConfigs: 'id, platformAccountId',
      credentialData: 'id, platformAccountId'
    });
  }
}

// Export singleton instance
export const db = new TokenMonitorDatabase();

// Export database type for TypeScript
export type TokenMonitorDB = TokenMonitorDatabase;
