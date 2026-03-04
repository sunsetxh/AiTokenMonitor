/**
 * Platform Filter Component
 * Multi-select checkbox for platforms
 */

import { PlatformType } from '../../models/types';

interface PlatformFilterProps {
  selected: string[];
  onChange: (platforms: string[]) => void;
}

const PLATFORMS: Array<{ value: PlatformType; label: string }> = [
  { value: 'claude', label: 'Claude' },
  { value: 'ark', label: 'Ark' },
  { value: 'zai', label: 'Zai' },
  { value: 'minimax', label: 'MiniMax' },
];

export function PlatformFilter({ selected, onChange }: PlatformFilterProps) {
  const handleToggle = (platform: string) => {
    if (selected.includes(platform)) {
      onChange(selected.filter((p) => p !== platform));
    } else {
      onChange([...selected, platform]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {PLATFORMS.map((platform) => (
        <label
          key={platform.value}
          className={`
            inline-flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-colors
            ${
              selected.includes(platform.value)
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }
          `}
        >
          <input
            type="checkbox"
            checked={selected.includes(platform.value)}
            onChange={() => handleToggle(platform.value)}
            className="sr-only"
          />
          <span className="text-sm font-medium">{platform.label}</span>
        </label>
      ))}
      {selected.length > 0 && (
        <button
          onClick={() => onChange([])}
          className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          清除
        </button>
      )}
    </div>
  );
}
