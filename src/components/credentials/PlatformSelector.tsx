/**
 * PlatformSelector Component
 * Dropdown for selecting AI platform with logos and names
 */

import { PlatformType } from '@/models/types';

interface PlatformSelectorProps {
  value: PlatformType | '';
  onChange: (platform: PlatformType) => void;
  disabled?: boolean;
}

const platforms: { type: PlatformType; name: string; logo: string }[] = [
  { type: 'zai', name: 'Zai', logo: '/logos/zai.svg' },
  { type: 'minimax', name: 'MiniMax', logo: '/logos/minimax.svg' }
];

export function PlatformSelector({ value, onChange, disabled }: PlatformSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Platform
      </label>
      <div className="grid grid-cols-2 gap-2">
        {platforms.map((platform) => (
          <button
            key={platform.type}
            type="button"
            disabled={disabled}
            onClick={() => onChange(platform.type)}
            className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
              value === platform.type
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
              <img
                src={platform.logo}
                alt={platform.name}
                className="w-5 h-5 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {platform.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
