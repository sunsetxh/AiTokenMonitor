/**
 * Credential Data model
 * Stores encrypted API credentials for platforms
 */

export interface CredentialData {
  id: string;
  platformAccountId: string;
  platformType: string;
  encryptedValue: string;
  validityStatus: 'valid' | 'invalid' | 'unknown' | 'expired';
  lastValidated: string | null;
  createdAt: string;
}

export type CredentialDataCreate = Omit<CredentialData, 'id' | 'createdAt'>;
