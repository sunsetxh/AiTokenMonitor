/**
 * CredentialCard Component
 * Displays a single credential with status indicator
 */

import { PlatformAccount } from '@/models/PlatformAccount';
import { CredentialData } from '@/models/CredentialData';
import { StatusBadge } from '@/components/common/StatusBadge';
import { UsageStatus } from '@/models/types';

interface CredentialCardProps {
  account: PlatformAccount;
  credential?: CredentialData;
  onEdit: (account: PlatformAccount) => void;
  onDelete: (account: PlatformAccount) => void;
  onConfigureThresholds: (account: PlatformAccount) => void;
}

export function CredentialCard({
  account,
  credential,
  onEdit,
  onDelete,
  onConfigureThresholds
}: CredentialCardProps) {
  const getStatusIndicator = (): UsageStatus => {
    if (!credential) return 'normal';
    // Map credential validity status to usage status
    switch (credential.validityStatus) {
      case 'valid':
        return 'normal';
      case 'invalid':
      case 'expired':
        return 'critical';
      default:
        return 'normal';
    }
  };

  const platformLogos: Record<string, string> = {
    ark: '/logos/ark.svg',
    zai: '/logos/zai.svg',
    minimax: '/logos/minimax.svg',
    claude: '/logos/claude.svg'
  };

  const platformNames: Record<string, string> = {
    ark: 'Ark',
    zai: 'Zai',
    minimax: 'MiniMax',
    claude: 'Claude'
  };

  const displayPlatform = account.platformName || 'claude';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
            <img
              src={platformLogos[displayPlatform]}
              alt={platformNames[displayPlatform]}
              className="w-6 h-6 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {account.accountLabel}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {platformNames[displayPlatform]}
            </p>
          </div>
        </div>
        <StatusBadge status={getStatusIndicator()} />
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onEdit(account)}
          className="flex-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onConfigureThresholds(account)}
          className="flex-1 px-3 py-1.5 text-sm bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
        >
          Thresholds
        </button>
        <button
          onClick={() => onDelete(account)}
          className="px-3 py-1.5 text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
