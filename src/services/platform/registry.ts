/**
 * Platform Registry
 * Manages all platform adapters
 */

import { PlatformType, PlatformAdapter } from '../../models/types';
import { zaiAdapter } from './zai';
import { minimaxAdapter } from './minimax';

/**
 * Registry of all platform adapters
 */
const adapters: Map<PlatformType, PlatformAdapter> = new Map([
  ['zai', zaiAdapter],
  ['minimax', minimaxAdapter],
]);

/**
 * Get adapter by platform type
 */
export function getAdapter(platformType: PlatformType): PlatformAdapter | undefined {
  return adapters.get(platformType);
}

/**
 * Get all registered adapters
 */
export function getAllAdapters(): PlatformAdapter[] {
  return Array.from(adapters.values());
}

/**
 * Get all supported platform types
 */
export function getSupportedPlatforms(): PlatformType[] {
  return Array.from(adapters.keys());
}

/**
 * Check if platform is supported
 */
export function isPlatformSupported(platformType: string): boolean {
  return adapters.has(platformType as PlatformType);
}

/**
 * Get platform display name
 */
export function getPlatformDisplayName(platformType: PlatformType): string {
  const adapter = adapters.get(platformType);
  return adapter?.getDisplayName() ?? platformType;
}

/**
 * Get platform logo URL
 */
export function getPlatformLogoUrl(platformType: PlatformType): string {
  const adapter = adapters.get(platformType);
  return adapter?.getLogoUrl() ?? '';
}

// Export individual adapters for convenience
export { zaiAdapter, minimaxAdapter };
