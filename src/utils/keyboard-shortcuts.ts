/**
 * Keyboard Shortcuts Utility
 * Global keyboard shortcuts for the application
 */

import { useEffect, useCallback } from 'react';

interface ShortcutHandler {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: () => void;
  description?: string;
}

const shortcuts: ShortcutHandler[] = [
  { key: 'r', handler: () => window.location.href = '/', description: '刷新/返回 Dashboard' },
  { key: 'c', handler: () => window.location.href = '/credentials', description: '打开凭证管理' },
  { key: 't', handler: () => window.location.href = '/trends', description: '打开趋势分析' },
];

/**
 * Hook for handling keyboard shortcuts
 */
export function useKeyboardShortcuts(enabled: boolean = true) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when typing in input fields
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    for (const shortcut of shortcuts) {
      const ctrlMatch = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey;
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
      const altMatch = shortcut.alt ? event.altKey : !event.altKey;
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        event.preventDefault();
        shortcut.handler();
        return;
      }
    }
  }, [enabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Get list of available shortcuts
 */
export function getShortcuts(): Array<{ key: string; description: string }> {
  return shortcuts.map(s => ({
    key: `${s.ctrl ? 'Ctrl+' : ''}${s.shift ? 'Shift+' : ''}${s.alt ? 'Alt+' : ''}${s.key.toUpperCase()}`,
    description: s.description || '',
  }));
}
