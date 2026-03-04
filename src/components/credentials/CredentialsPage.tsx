/**
 * Credentials Page
 * Manages platform API credentials
 */

import { useState, useEffect } from 'react';
import { PlatformType, LimitType } from '@/models/types';
import { CredentialFormData } from './CredentialForm';
import { CredentialList } from './CredentialList';
import { CredentialInputDialog } from './CredentialInputDialog';
import { DeleteConfirmationDialog } from '../common/DeleteConfirmationDialog';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import {
  addPlatformWithCredentials,
  deletePlatformWithCredentials,
  getAccountsWithStatus,
  updateCredential,
} from '../../services/credentials/credential-manager';
import { ThresholdConfigDialog } from '../thresholds/ThresholdConfigDialog';
import { getThresholdConfig as getThresholdConfigAPI, saveThresholdConfig } from '../../services/api/backend-api';

interface AccountWithStatus {
  id: string;
  platformName: string;
  accountLabel: string;
  limitType: string;
  createdAt: string;
  credentialStatus?: string | null;
}

export function CredentialsPage() {
  const [accounts, setAccounts] = useState<AccountWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountWithStatus | null>(null);
  const [configuringThresholdId, setConfiguringThresholdId] = useState<string | null>(null);
  const [thresholdWarning, setThresholdWarning] = useState(70);
  const [thresholdCritical, setThresholdCritical] = useState(90);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const accountsWithStatus = await getAccountsWithStatus();
      // New API returns flat objects, not nested account property
      const mapped: AccountWithStatus[] = accountsWithStatus.map(a => ({
        id: a.id,
        platformName: a.platformName,
        accountLabel: a.accountLabel,
        limitType: a.limitType,
        createdAt: a.createdAt,
        credentialStatus: a.status,
      }));
      setAccounts(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (data: CredentialFormData) => {
    try {
      setError(null);
      await addPlatformWithCredentials(
        data.platformName,
        data.accountLabel,
        data.limitType,
        data.credentials
      );
      setIsAdding(false);
      await loadAccounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '添加失败');
    }
  };

  const handleEdit = (id: string) => {
    const account = accounts.find(a => a.id === id);
    if (account) {
      setEditingAccount(account);
    }
  };

  const handleSaveEdit = async (data: CredentialFormData) => {
    if (!editingAccount) return;
    try {
      setError(null);
      // Update credential if changed
      if (data.credentials) {
        await updateCredential(editingAccount.id, data.credentials);
      }
      setEditingAccount(null);
      await loadAccounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失败');
    }
  };

  const handleConfigureThreshold = async (id: string) => {
    // Load existing threshold config if any
    const config = await getThresholdConfigAPI(id);
    if (config) {
      setThresholdWarning(config.warningPercent);
      setThresholdCritical(config.criticalPercent);
    } else {
      setThresholdWarning(70);
      setThresholdCritical(90);
    }
    setConfiguringThresholdId(id);
  };

  const handleSaveThreshold = async (warning: number, critical: number) => {
    if (!configuringThresholdId) return;
    try {
      setError(null);
      await saveThresholdConfig(configuringThresholdId, { warningPercent: warning, criticalPercent: critical, notificationsEnabled: true });
      setConfiguringThresholdId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存阈值失败');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setError(null);
      await deletePlatformWithCredentials(deleteId);
      setDeleteId(null);
      await loadAccounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">凭证管理</h2>
        <LoadingSpinner size="lg" className="py-12" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">凭证管理</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            添加凭证
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6">
          <ErrorMessage
            title="操作失败"
            message={error}
            onDismiss={() => setError(null)}
          />
        </div>
      )}

      {/* Add Dialog */}
      <CredentialInputDialog
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        onSave={handleAdd}
        isValidating={false}
      />

      {/* Edit Dialog */}
      <CredentialInputDialog
        isOpen={!!editingAccount}
        onClose={() => setEditingAccount(null)}
        onSave={handleSaveEdit}
        editingAccount={editingAccount ? {
          id: editingAccount.id,
          platformName: editingAccount.platformName as PlatformType,
          accountLabel: editingAccount.accountLabel,
          limitType: editingAccount.limitType as LimitType,
          createdAt: editingAccount.createdAt,
          updatedAt: editingAccount.createdAt,
        } : undefined}
        isValidating={false}
      />

      {/* Threshold Config Dialog */}
      <ThresholdConfigDialog
        isOpen={!!configuringThresholdId}
        accountName={accounts.find(a => a.id === configuringThresholdId)?.accountLabel || ''}
        initialWarning={thresholdWarning}
        initialCritical={thresholdCritical}
        onSave={handleSaveThreshold}
        onClose={() => setConfiguringThresholdId(null)}
      />

      {/* Credential List */}
      <CredentialList
        accounts={accounts}
        onEdit={handleEdit}
        onDelete={(id) => setDeleteId(id)}
        onConfigureThreshold={handleConfigureThreshold}
      />

      {/* Delete Confirmation Dialog */}
      {deleteId && (
        <DeleteConfirmationDialog
          title="删除凭证"
          message="确定要删除此凭证吗？此操作将同时删除相关的使用记录和配置，且无法恢复。"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
