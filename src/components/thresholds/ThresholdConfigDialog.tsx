/**
 * Threshold Config Dialog Component
 * Modal for editing thresholds
 */

import { useState } from 'react';
import { ThresholdConfigEditor } from './ThresholdConfigEditor';

interface ThresholdConfigDialogProps {
  isOpen: boolean;
  accountName: string;
  initialWarning?: number;
  initialCritical?: number;
  onSave: (warning: number, critical: number) => void;
  onClose: () => void;
}

export function ThresholdConfigDialog({
  isOpen,
  accountName,
  initialWarning = 70,
  initialCritical = 90,
  onSave,
  onClose,
}: ThresholdConfigDialogProps) {
  const [warning, setWarning] = useState(initialWarning);
  const [critical, setCritical] = useState(initialCritical);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(warning, critical);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            配置阈值 - {accountName}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <ThresholdConfigEditor
            warningPercent={warning}
            criticalPercent={critical}
            onChange={(w, c) => {
              setWarning(w);
              setCritical(c);
            }}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
