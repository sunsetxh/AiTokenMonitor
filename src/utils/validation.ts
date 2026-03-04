/**
 * Validation utility functions
 */

/**
 * Validate a UUID v4 string
 * @param uuid - String to validate
 * @returns true if valid UUID v4
 */
export function validateUUID(uuid: string): boolean {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}

/**
 * Validate a percentage value (0-100)
 * @param percent - Value to validate
 * @returns true if valid percentage
 */
export function validatePercentage(percent: number): boolean {
  return typeof percent === 'number' && !isNaN(percent) && percent >= 0 && percent <= 100;
}

/**
 * Validate account label
 * @param label - Label to validate
 * @param minLength - Minimum length (default: 1)
 * @param maxLength - Maximum length (default: 50)
 * @returns true if valid label
 */
export function validateAccountLabel(
  label: string,
  minLength: number = 1,
  maxLength: number = 50
): boolean {
  return (
    typeof label === 'string' &&
    label.trim().length >= minLength &&
    label.trim().length <= maxLength
  );
}

/**
 * Validate platform type
 * @param platform - String to validate
 * @returns true if valid platform type
 */
export function validatePlatformType(platform: string): boolean {
  const validPlatforms = ['ark', 'zai', 'minimax', 'claude'];
  return validPlatforms.includes(platform);
}

/**
 * Validate limit type
 * @param limitType - String to validate
 * @returns true if valid limit type
 */
export function validateLimitType(limitType: string): boolean {
  const validTypes = ['daily', 'monthly', 'cumulative'];
  return validTypes.includes(limitType);
}

/**
 * Validate credential status
 * @param status - String to validate
 * @returns true if valid credential status
 */
export function validateCredentialStatus(status: string): boolean {
  const validStatuses = ['valid', 'invalid', 'unknown', 'expired'];
  return validStatuses.includes(status);
}

/**
 * Validate token values
 * @param tokensUsed - Tokens used value
 * @param quotaTotal - Total quota value
 * @returns Object with validation result and error message
 */
export function validateTokenValues(tokensUsed: number, quotaTotal: number): {
  valid: boolean;
  error?: string;
} {
  if (typeof tokensUsed !== 'number' || isNaN(tokensUsed) || tokensUsed < 0) {
    return { valid: false, error: 'tokensUsed must be a non-negative number' };
  }

  if (typeof quotaTotal !== 'number' || isNaN(quotaTotal) || quotaTotal <= 0) {
    return { valid: false, error: 'quotaTotal must be a positive number' };
  }

  if (tokensUsed > quotaTotal) {
    return { valid: false, error: 'tokensUsed cannot exceed quotaTotal' };
  }

  return { valid: true };
}

/**
 * Validate ISO 8601 timestamp
 * @param timestamp - String to validate
 * @returns true if valid ISO 8601 timestamp
 */
export function validateTimestamp(timestamp: string): boolean {
  const date = new Date(timestamp);
  return !isNaN(date.getTime()) && timestamp.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/) !== null;
}

/**
 * Validate threshold configuration
 * @param warningPercent - Warning threshold percentage
 * @param criticalPercent - Critical threshold percentage
 * @returns Object with validation result and error message
 */
export function validateThresholdConfig(warningPercent: number, criticalPercent: number): {
  valid: boolean;
  error?: string;
} {
  if (!validatePercentage(warningPercent)) {
    return { valid: false, error: 'warningPercent must be between 0 and 100' };
  }

  if (!validatePercentage(criticalPercent)) {
    return { valid: false, error: 'criticalPercent must be between 0 and 100' };
  }

  if (warningPercent >= criticalPercent) {
    return { valid: false, error: 'warningPercent must be less than criticalPercent' };
  }

  return { valid: true };
}

/**
 * Validate API key format (basic check)
 * @param apiKey - API key to validate
 * @returns true if appears to be a valid API key format
 */
export function validateApiKey(apiKey: string): boolean {
  // Basic validation: non-empty, reasonable length
  return (
    typeof apiKey === 'string' &&
    apiKey.trim().length > 0 &&
    apiKey.trim().length >= 10 &&
    apiKey.trim().length <= 200
  );
}

/**
 * Sanitize user input
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  return input.trim().slice(0, 200);
}

/**
 * Validate retention days
 * @param days - Number of days to validate
 * @returns true if valid retention period
 */
export function validateRetentionDays(days: number): boolean {
  return Number.isInteger(days) && days >= 1 && days <= 365;
}

/**
 * Validate fetch interval (milliseconds)
 * @param interval - Interval in milliseconds
 * @returns true if valid interval
 */
export function validateFetchInterval(interval: number): boolean {
  const minInterval = 60000; // 1 minute
  const maxInterval = 3600000; // 1 hour
  return (
    Number.isInteger(interval) && interval >= minInterval && interval <= maxInterval
  );
}
