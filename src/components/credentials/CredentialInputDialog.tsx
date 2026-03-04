/**
 * CredentialInputDialog Component
 * Modal for adding/editing credentials
 */

import { useState, useEffect } from 'react';
import { PlatformType } from '@/models/types';
import { PlatformAccount } from '@/models/PlatformAccount';
import { PlatformSelector } from './PlatformSelector';
import { CredentialFormData } from './CredentialForm';

interface CredentialInputDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: CredentialFormData) => void;
  editingAccount?: PlatformAccount | null;
  isValidating?: boolean;
}

export function CredentialInputDialog({
  isOpen,
  onClose,
  onSave,
  editingAccount,
  isValidating
}: CredentialInputDialogProps) {
  const [platform, setPlatform] = useState<PlatformType>('zai');
  const [formData, setFormData] = useState<CredentialFormData>({
    platformName: 'zai',
    accountLabel: '',
    limitType: 'monthly',
    credentials: ''
  });

  useEffect(() => {
    if (editingAccount) {
      setFormData({
        platformName: editingAccount.platformName,
        accountLabel: editingAccount.accountLabel,
        limitType: editingAccount.limitType as 'daily' | 'monthly' | 'cumulative',
        credentials: ''
      });
      setPlatform(editingAccount.platformName);
    } else {
      setFormData({
        platformName: 'zai',
        accountLabel: '',
        limitType: 'monthly',
        credentials: ''
      });
      setPlatform('zai');
    }
  }, [editingAccount, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.accountLabel || !formData.credentials) return;
    onSave({ ...formData, platformName: platform });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {editingAccount ? 'Edit Credential' : 'Add Credential'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <PlatformSelector
            value={platform}
            onChange={(p) => {
              setPlatform(p);
              setFormData(prev => ({ ...prev, platformName: p }));
            }}
            disabled={!!editingAccount}
          />

          {platform && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account Label
                </label>
                <input
                  type="text"
                  value={formData.accountLabel}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountLabel: e.target.value }))}
                  placeholder="e.g., My Production Account"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Limit Type
                </label>
                <select
                  value={formData.limitType}
                  onChange={(e) => setFormData(prev => ({ ...prev, limitType: e.target.value as 'daily' | 'monthly' | 'cumulative' }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                  <option value="cumulative">Cumulative</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  API Key {editingAccount ? '(留空保持不变)' : ''}
                </label>
                <input
                  type="password"
                  value={formData.credentials}
                  onChange={(e) => setFormData(prev => ({ ...prev, credentials: e.target.value }))}
                  placeholder="Enter API Key"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.accountLabel || (!editingAccount && !formData.credentials) || isValidating}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isValidating ? 'Validating...' : editingAccount ? 'Save Changes' : 'Add Credential'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
