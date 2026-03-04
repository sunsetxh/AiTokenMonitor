/**
 * Platform Account model
 * Represents a single API account on a specific AI platform
 */

import { PlatformType, LimitType } from './types';

export interface PlatformAccount {
  id: string;
  platformName: PlatformType;
  accountLabel: string;
  limitType: LimitType;
  createdAt: string;
  updatedAt: string;
}

export type PlatformAccountCreate = Omit<PlatformAccount, 'id' | 'createdAt' | 'updatedAt'>;

export type PlatformAccountUpdate = Partial<Omit<PlatformAccount, 'id' | 'createdAt'>>;
