/**
 * Credential Form Component
 * Form for adding/editing credentials
 */

import { useState } from 'react';
import { PlatformType } from '../../models/types';

interface CredentialFormProps {
  onSubmit: (data: CredentialFormData) => void;
  onCancel?: () => void;
  initialData?: CredentialFormData;
  isLoading?: boolean;
}

export interface CredentialFormData {
  platformName: PlatformType;
  accountLabel: string;
  limitType: 'daily' | 'monthly' | 'cumulative';
  credentials: string;
  additionalFields?: Record<string, string>;
}

const PLATFORMS: Array<{ value: PlatformType; label: string }> = [
  { value: 'claude', label: 'Claude (Anthropic)' },
  { value: 'ark', label: 'Ark' },
  { value: 'zai', label: 'Zai' },
  { value: 'minimax', label: 'MiniMax' },
];

const LIMIT_TYPES = [
  { value: 'monthly', label: '每月重置' },
  { value: 'daily', label: '每日重置' },
  { value: 'cumulative', label: '累计不重置' },
];

export function CredentialForm({ onSubmit, onCancel, initialData, isLoading }: CredentialFormProps) {
  const [platformName, setPlatformName] = useState<PlatformType>(initialData?.platformName || 'claude');
  const [accountLabel, setAccountLabel] = useState(initialData?.accountLabel || '');
  const [limitType, setLimitType] = useState<'daily' | 'monthly' | 'cumulative'>(initialData?.limitType || 'monthly');
  const [credentials, setCredentials] = useState(initialData?.credentials || '');
  const [showCredentials, setShowCredentials] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      platformName,
      accountLabel,
      limitType,
      credentials,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Platform Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          平台
        </label>
        <select
          value={platformName}
          onChange={(e) => setPlatformName(e.target.value as PlatformType)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          {PLATFORMS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Account Label */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          账户名称
        </label>
        <input
          type="text"
          value={accountLabel}
          onChange={(e) => setAccountLabel(e.target.value)}
          placeholder="例如：我的 Claude 账号"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          minLength={1}
          maxLength={50}
        />
      </div>

      {/* Limit Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          配额重置周期
        </label>
        <select
          value={limitType}
          onChange={(e) => setLimitType(e.target.value as 'daily' | 'monthly' | 'cumulative')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          {LIMIT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Credentials */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          API Key
        </label>
        <div className="relative">
          <input
            type={showCredentials ? 'text' : 'password'}
            value={credentials}
            onChange={(e) => setCredentials(e.target.value)}
            placeholder={platformName === 'claude' ? 'sk-ant-api03-...' : '输入 API Key'}
            className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <button
            type="button"
            onClick={() => setShowCredentials(!showCredentials)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {showCredentials ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors duration-200"
          >
            取消
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading || !credentials || !accountLabel}
          className={`py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 disabled:cursor-not-allowed ${onCancel ? 'flex-1' : 'w-full'}`}
        >
          {isLoading ? '保存中...' : '保存'}
        </button>
      </div>
    </form>
  );
}
