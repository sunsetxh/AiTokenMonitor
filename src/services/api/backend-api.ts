/**
 * Backend API Service
 * Calls the backend proxy server for credential and usage storage
 */

const API_BASE = ''; // Use relative path, goes through Vite proxy

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

// ============ Credentials API ============

export interface Credential {
  id: string;
  platform: string;
  label: string;
  limitType: string;
  createdAt: string;
  updatedAt: string;
}

export interface CredentialInput {
  platform: string;
  label: string;
  credential: string;
  limitType?: string;
}

export async function getCredentials(): Promise<Credential[]> {
  const result = await request<{ success: boolean; data: any[] }>('/api/credentials');
  return result.data.map(row => ({
    id: row.id,
    platform: row.platform,
    label: row.label,
    limitType: row.limit_type,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function getCredential(id: string): Promise<{ credential: string }> {
  const result = await request<{ success: boolean; data: any }>(`/api/credentials/${id}`);
  return { credential: result.data.credential };
}

export async function addCredential(input: CredentialInput): Promise<{ id: string }> {
  const result = await request<{ success: boolean; data: { id: string } }>('/api/credentials', {
    method: 'POST',
    body: JSON.stringify({
      platform: input.platform,
      label: input.label,
      credential: input.credential,
      limitType: input.limitType,
    }),
  });
  return { id: result.data.id };
}

export async function updateCredential(id: string, data: { label?: string; credential?: string; limitType?: string }): Promise<void> {
  await request(`/api/credentials/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCredential(id: string): Promise<void> {
  await request(`/api/credentials/${id}`, {
    method: 'DELETE',
  });
}

// ============ Usage Records API ============

export interface UsageRecord {
  id: string;
  platformAccountId: string;
  tokensUsed: number;
  tokensRemaining: number;
  quotaTotal: number;
  timestamp: string;
  nextResetTime?: string;
}

export async function getUsageRecords(platformAccountId: string): Promise<UsageRecord[]> {
  const result = await request<{ success: boolean; data: any[] }>(`/api/usage/${platformAccountId}`);
  return result.data.map(row => ({
    id: row.id,
    platformAccountId: row.platform_account_id,
    tokensUsed: row.tokens_used,
    tokensRemaining: row.tokens_remaining,
    quotaTotal: row.quota_total,
    timestamp: row.timestamp,
    nextResetTime: row.next_reset_time,
  }));
}

export async function saveUsageRecord(record: Omit<UsageRecord, 'id'>): Promise<void> {
  await request('/api/usage', {
    method: 'POST',
    body: JSON.stringify({
      platformAccountId: record.platformAccountId,
      tokensUsed: record.tokensUsed,
      tokensRemaining: record.tokensRemaining,
      quotaTotal: record.quotaTotal,
      timestamp: record.timestamp,
      nextResetTime: record.nextResetTime,
    }),
  });
}

export async function getLatestUsage(): Promise<Map<string, UsageRecord>> {
  const result = await request<{ success: boolean; data: Record<string, any> }>('/api/usage/latest');
  const map = new Map<string, UsageRecord>();
  for (const [platformAccountId, row] of Object.entries(result.data)) {
    map.set(platformAccountId, {
      id: (row as any).id,
      platformAccountId,
      tokensUsed: (row as any).tokens_used,
      tokensRemaining: (row as any).tokens_remaining,
      quotaTotal: (row as any).quota_total,
      timestamp: (row as any).timestamp,
      nextResetTime: (row as any).next_reset_time,
    });
  }
  return map;
}

// ============ Threshold Config API ============

export interface ThresholdConfig {
  warningPercent: number;
  criticalPercent: number;
  notificationsEnabled: boolean;
}

export async function getThresholdConfig(platformAccountId: string): Promise<ThresholdConfig | null> {
  const result = await request<{ success: boolean; data: any }>(`/api/thresholds/${platformAccountId}`);
  if (!result.data) return null;
  return {
    warningPercent: result.data.warning_percent,
    criticalPercent: result.data.critical_percent,
    notificationsEnabled: !!result.data.notifications_enabled,
  };
}

export async function saveThresholdConfig(platformAccountId: string, config: ThresholdConfig): Promise<void> {
  await request('/api/thresholds', {
    method: 'POST',
    body: JSON.stringify({
      platformAccountId,
      warningPercent: config.warningPercent,
      criticalPercent: config.criticalPercent,
      notificationsEnabled: config.notificationsEnabled,
    }),
  });
}
