export const STORAGE_KEYS = { profile:'catti.profile', sessions:'catti.trainingSessions', collections:'catti.collections', favorites:'catti.favorites', paragraphDrafts:'catti.paragraphDrafts' };

export function readStorage(key, fallback, storage = globalThis.localStorage) {
  try { const value = JSON.parse(storage.getItem(key) ?? 'null'); return value ?? fallback; } catch { return fallback; }
}
export function writeStorage(key, value, storage = globalThis.localStorage) { storage.setItem(key, JSON.stringify(value)); return value; }
export function removeStorage(key, storage = globalThis.localStorage) { storage.removeItem(key); }
export const storage = { read: readStorage, write: writeStorage, remove: removeStorage, keys: STORAGE_KEYS };
