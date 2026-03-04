/**
 * Credential List Component
 * Displays all configured credentials
 */

interface CredentialListProps {
  accounts: Array<{
    id: string;
    platformName: string;
    accountLabel: string;
    limitType: string;
    createdAt: string;
    credentialStatus?: string | null;
  }>;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onConfigureThreshold: (id: string) => void;
}

const PLATFORM_LABELS: Record<string, string> = {
  claude: 'Claude',
  ark: 'Ark',
  zai: 'Zai',
  minimax: 'MiniMax',
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  valid: { label: '有效', color: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300' },
  invalid: { label: '无效', color: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300' },
  unknown: { label: '未验证', color: 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300' },
  expired: { label: '已过期', color: 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300' },
};

export function CredentialList({ accounts, onEdit, onDelete, onConfigureThreshold }: CredentialListProps) {
  if (accounts.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">暂无凭证</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          添加您的第一个平台凭证以开始监控
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {accounts.map((account) => {
        const statusConfig = STATUS_CONFIG[account.credentialStatus || 'unknown'];

        return (
          <div
            key={account.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
          >
            {/* Account Info */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {PLATFORM_LABELS[account.platformName]?.charAt(0) || account.platformName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{account.accountLabel}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {PLATFORM_LABELS[account.platformName] || account.platformName} · {account.limitType === 'monthly' ? '每月重置' : account.limitType === 'daily' ? '每日重置' : '累计'}
                </p>
              </div>
            </div>

            {/* Status & Actions */}
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.color}`}>
                {statusConfig.label}
              </span>

              <button
                onClick={() => onConfigureThreshold(account.id)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="配置阈值"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              <button
                onClick={() => onEdit(account.id)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="编辑"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>

              <button
                onClick={() => onDelete(account.id)}
                className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                title="删除"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
