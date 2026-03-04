/**
 * Base type definitions for the AI Token Monitor application
 */

// Platform Types
export type PlatformType = 'zai' | 'minimax';
export type LimitType = 'daily' | 'monthly' | 'cumulative';
export type CredentialStatus = 'valid' | 'invalid' | 'unknown' | 'expired';
export type UsageStatus = 'normal' | 'warning' | 'critical';

/**
 * Platform adapter interface for all platform integrations
 */
export interface PlatformAdapter {
  readonly name: PlatformType;
  getDisplayName(): string;
  getLogoUrl(): string;
  validateCredentials(credentials: string): Promise<boolean>;
  fetchUsage(credentials: string): Promise<UsageData>;
  getLimitType(): LimitType;
  getCredentialFormat(): CredentialFormat;
  supportsDirectBrowserCall(): Promise<boolean>;
}

/**
 * Usage data returned from platform API
 */
export interface UsageData {
  tokensUsed: number;
  quotaTotal: number;
  tokensRemaining: number;
  timestamp: string;
  nextResetTime?: string;
  rawResponse?: unknown;
}

/**
 * Credential format for UI display
 */
export interface CredentialFormat {
  type: 'api_key' | 'bearer_token' | 'oauth' | 'basic_auth';
  label: string;
  placeholder: string;
  additionalFields?: Array<{
    key: string;
    label: string;
    placeholder: string;
    required: boolean;
  }>;
  description?: string;
  helpUrl?: string;
}

/**
 * Platform adapter error types
 */
export class PlatformAdapterError extends Error {
  constructor(
    message: string,
    public readonly platform: PlatformType,
    public readonly code: string
  ) {
    super(message);
    this.name = 'PlatformAdapterError';
  }
}

export class AuthenticationError extends PlatformAdapterError {
  constructor(platform: PlatformType, message: string = '认证失败，请检查凭证') {
    super(message, platform, 'AUTH_FAILED');
    this.name = 'AuthenticationError';
  }
}

export class NetworkError extends PlatformAdapterError {
  constructor(
    platform: PlatformType,
    public readonly originalError: Error
  ) {
    super(`网络请求失败: ${originalError.message}`, platform, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class RateLimitError extends PlatformAdapterError {
  constructor(
    platform: PlatformType,
    public readonly retryAfter?: number
  ) {
    super(
      `请求过于频繁${retryAfter ? `，请在 ${retryAfter} 秒后重试` : ''}`,
      platform,
      'RATE_LIMITED'
    );
    this.name = 'RateLimitError';
  }
}

export class ValidationError extends PlatformAdapterError {
  constructor(platform: PlatformType, message: string) {
    super(message, platform, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class ParseError extends PlatformAdapterError {
  constructor(
    platform: PlatformType,
    public readonly rawResponse: string
  ) {
    super('API响应解析失败', platform, 'PARSE_ERROR');
    this.name = 'ParseError';
  }
}

/**
 * Storage error types
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

export class NotFoundError extends StorageError {
  constructor(entity: string, id: string) {
    super(`${entity} with id '${id}' not found`, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class DuplicateError extends StorageError {
  constructor(entity: string, field: string, value: string) {
    super(`${entity} with ${field} '${value}' already exists`, 'DUPLICATE');
    this.name = 'DuplicateError';
  }
}

export class ImportError extends StorageError {
  constructor(message: string) {
    super(message, 'IMPORT_ERROR');
    this.name = 'ImportError';
  }
}

/**
 * Platform display information
 */
export interface PlatformInfo {
  type: PlatformType;
  displayName: string;
  logoUrl: string;
  limitType: LimitType;
}
