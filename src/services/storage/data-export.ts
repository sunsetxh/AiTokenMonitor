/**
 * Data Export/Import Service
 * Backup and restore user data
 */

import { exportData, importData, clearAll } from './storage-service';

/**
 * Export all user data to a JSON file
 */
export async function exportToFile(): Promise<void> {
  const data = await exportData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `ai-token-monitor-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import data from a JSON file
 */
export async function importFromFile(file: File): Promise<{ success: boolean; message: string }> {
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    await importData(parsed);
    return { success: true, message: '数据导入成功' };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '导入失败'
    };
  }
}

/**
 * Clear all data (with user confirmation)
 */
export async function clearAllData(): Promise<void> {
  await clearAll();
}

/**
 * Get storage estimate
 */
export async function getStorageEstimate(): Promise<{ usage: number; quota: number }> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage || 0,
      quota: estimate.quota || 0,
    };
  }
  return { usage: 0, quota: 0 };
}
