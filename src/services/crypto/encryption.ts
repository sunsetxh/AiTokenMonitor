/**
 * Encryption service for secure credential storage
 * Uses Web Crypto API for browser-native encryption
 * Falls back to simple encoding when crypto.subtle is not available
 */

// Encryption key storage key
const ENCRYPTION_KEY_NAME = 'token-monitor-encryption-key';

/**
 * Check if Web Crypto API is available
 */
function isCryptoAvailable(): boolean {
  return typeof crypto !== 'undefined' &&
         typeof crypto.subtle !== 'undefined' &&
         typeof crypto.subtle.generateKey === 'function';
}

/**
 * Generate a random encryption key
 */
async function generateKey(): Promise<CryptoKey> {
  if (!isCryptoAvailable()) {
    throw new Error('Web Crypto API not available. Use HTTPS or localhost.');
  }
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Get or create the encryption key
 */
async function getEncryptionKey(): Promise<CryptoKey | null> {
  if (!isCryptoAvailable()) {
    return null;
  }

  // Try to get existing key from localStorage
  const storedKey = localStorage.getItem(ENCRYPTION_KEY_NAME);
  if (storedKey) {
    const keyData = JSON.parse(storedKey);
    return await crypto.subtle.importKey(
      'jwk',
      keyData,
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // Generate new key
  const key = await generateKey();
  const keyData = await crypto.subtle.exportKey('jwk', key);
  localStorage.setItem(ENCRYPTION_KEY_NAME, JSON.stringify(keyData));
  return key;
}

/**
 * Encrypt plaintext data
 */
export async function encrypt(plaintext: string): Promise<string> {
  // Fallback: simple base64 encoding when crypto is not available
  if (!isCryptoAvailable()) {
    console.warn('Web Crypto API not available, using simple encoding');
    return btoa(plaintext);
  }

  const key = await getEncryptionKey();
  if (!key) {
    return btoa(plaintext);
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  // Generate random IV (initialization vector)
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Encrypt
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    data
  );

  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);

  // Return as base64
  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt encrypted data
 */
export async function decrypt(ciphertext: string): Promise<string> {
  try {
    if (!isCryptoAvailable()) {
      // Fallback: simple base64 decoding
      return atob(ciphertext);
    }

    const key = await getEncryptionKey();
    if (!key) {
      return atob(ciphertext);
    }

    // Decode from base64
    const combined = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encrypted
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    // If decryption fails, try plain base64
    try {
      return atob(ciphertext);
    } catch {
      throw new Error('Decryption failed: Invalid ciphertext or corrupted data');
    }
  }
}

/**
 * Reset encryption key (WARNING: This will make all encrypted data unreadable)
 */
export async function resetEncryptionKey(): Promise<void> {
  localStorage.removeItem(ENCRYPTION_KEY_NAME);
}

/**
 * Check if encryption key exists
 */
export function hasEncryptionKey(): boolean {
  return localStorage.getItem(ENCRYPTION_KEY_NAME) !== null;
}
