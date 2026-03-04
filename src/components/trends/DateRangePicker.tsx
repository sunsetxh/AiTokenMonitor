/**
 * Date Range Picker Component
 * Preset buttons for common date ranges
 */

type DatePreset = '7d' | '14d' | '30d' | '90d';

interface DateRangePickerProps {
  value: DatePreset;
  onChange: (preset: DatePreset) => void;
}

const PRESETS: Array<{ value: DatePreset; label: string }> = [
  { value: '7d', label: '7天' },
  { value: '14d', label: '14天' },
  { value: '30d', label: '30天' },
  { value: '90d', label: '90天' },
];

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
      {PRESETS.map((preset) => (
        <button
          key={preset.value}
          onClick={() => onChange(preset.value)}
          className={`
            px-3 py-1.5 text-sm font-medium rounded-md transition-colors
            ${
              value === preset.value
                ? 'bg-white text-gray-900 dark:bg-gray-600 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }
          `}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}
