/**
 * Created by Risyandi in collaboration with AI.
 * Contact: hello@risyandi.com
 * Licensed under the MIT License
 * LocalSessionStorage utility for per-tab browser session storage with JSON helpers.
 */

const getSessionStorage = () => {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) return window.sessionStorage;
    if (typeof sessionStorage !== 'undefined') return sessionStorage;
  } catch {
    return null;
  }
  return null;
};

export const LocalSessionStorage = {
  /**
   * Get an item from sessionStorage by key.
   * @param {string} keyName
   * @returns {string|null}
   */
  get(keyName) {
    const storage = getSessionStorage();
    if (!storage) return null;
    try {
      return storage.getItem(keyName);
    } catch (error) {
      console.warn(`[local-storage-browser] Error getting sessionStorage key "${keyName}":`, error);
      return null;
    }
  },

  /**
   * Set an item in sessionStorage.
   * @param {string} keyName
   * @param {any} data
   * @returns {boolean} Returns true if successfully set, false otherwise.
   */
  set(keyName, data) {
    const storage = getSessionStorage();
    if (!storage) return false;
    try {
      const valueToStore = typeof data === 'object' && data !== null ? JSON.stringify(data) : String(data);
      storage.setItem(keyName, valueToStore);
      return true;
    } catch (error) {
      console.warn(`[local-storage-browser] Error setting sessionStorage key "${keyName}":`, error);
      return false;
    }
  },

  /**
   * Get and parse a JSON item from sessionStorage.
   * @template T
   * @param {string} keyName
   * @param {T} [fallback=null]
   * @returns {T|null}
   */
  getJSON(keyName, fallback = null) {
    const raw = this.get(keyName);
    if (raw === null) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  },

  /**
   * Set a JSON-serializable item in sessionStorage.
   * @param {string} keyName
   * @param {any} data
   * @returns {boolean}
   */
  setJSON(keyName, data) {
    return this.set(keyName, data);
  },

  /**
   * Remove an item from sessionStorage by key.
   * @param {string} keyName
   * @returns {boolean}
   */
  remove(keyName) {
    const storage = getSessionStorage();
    if (!storage) return false;
    try {
      storage.removeItem(keyName);
      return true;
    } catch (error) {
      console.warn(`[local-storage-browser] Error removing sessionStorage key "${keyName}":`, error);
      return false;
    }
  },

  /**
   * Clear all items from sessionStorage.
   * @returns {boolean}
   */
  clearAll() {
    const storage = getSessionStorage();
    if (!storage) return false;
    try {
      storage.clear();
      return true;
    } catch (error) {
      console.warn('[local-storage-browser] Error clearing sessionStorage:', error);
      return false;
    }
  },

  /**
   * Check if a key exists in sessionStorage.
   * @param {string} keyName
   * @returns {boolean}
   */
  has(keyName) {
    return this.get(keyName) !== null;
  },

  /**
   * Get total number of items stored in sessionStorage.
   * @returns {number}
   */
  length() {
    const storage = getSessionStorage();
    if (!storage) return 0;
    try {
      return storage.length;
    } catch {
      return 0;
    }
  },

  /**
   * Get the key name at a given index.
   * @param {number} index
   * @returns {string|null}
   */
  key(index) {
    const storage = getSessionStorage();
    if (!storage) return null;
    try {
      return storage.key(index);
    } catch {
      return null;
    }
  },

  /**
   * Return an array of all keys currently in sessionStorage.
   * @returns {string[]}
   */
  keys() {
    const storage = getSessionStorage();
    if (!storage) return [];
    try {
      const result = [];
      const len = storage.length;
      for (let i = 0; i < len; i++) {
        const k = storage.key(i);
        if (k !== null) result.push(k);
      }
      return result;
    } catch {
      return [];
    }
  }
};
