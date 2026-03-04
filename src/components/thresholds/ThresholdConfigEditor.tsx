/**
 * Threshold Config Editor Component
 * Sliders for warning/critical percentage settings
 */

import { useState } from 'react';

interface ThresholdConfigEditorProps {
  warningPercent: number;
  criticalPercent: number;
  onChange: (warning: number, critical: number) => void;
  disabled?: boolean;
}

export function ThresholdConfigEditor({
  warningPercent,
  criticalPercent,
  onChange,
  disabled = false,
}: ThresholdConfigEditorProps) {
  const [warning, setWarning] = useState(warningPercent);
  const [critical, setCritical] = useState(criticalPercent);

  const handleWarningChange = (value: number) => {
    // Warning must be less than critical
    const newWarning = Math.min(value, critical - 1);
    setWarning(newWarning);
    onChange(newWarning, critical);
  };

  const handleCriticalChange = (value: number) => {
    // Critical must be greater than warning
    const newCritical = Math.max(value, warning + 1);
    setCritical(newCritical);
    onChange(warning, newCritical);
  };

  return (
    <div className="space-y-6">
      {/* Warning Threshold */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            警告阈值
          </label>
          <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
            {warning}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={warning}
          onChange={(e) => handleWarningChange(Number(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          超过此百分比显示警告
        </p>
      </div>

      {/* Critical Threshold */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            严重阈值
          </label>
          <span className="text-sm font-semibold text-red-600 dark:text-red-400">
            {critical}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={critical}
          onChange={(e) => handleCriticalChange(Number(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          超过此百分比显示严重警告
        </p>
      </div>

      {/* Visual Preview */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
          {/* Normal zone */}
          <div
            className="absolute left-0 top-0 h-full bg-green-500"
            style={{ width: `${warning}%` }}
          />
          {/* Warning zone */}
          <div
            className="absolute top-0 h-full bg-yellow-500"
            style={{ left: `${warning}%`, width: `${critical - warning}%` }}
          />
          {/* Critical zone */}
          <div
            className="absolute top-0 h-full bg-red-500"
            style={{ left: `${critical}%`, width: `${100 - critical}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span>0%</span>
          <span>{warning}%</span>
          <span>{critical}%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
