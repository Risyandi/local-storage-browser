/**
 * Created by Risyandi in collaboration with AI.
 * Contact: hello@risyandi.com
 * Licensed under the MIT License
 * LocalExtensionStorage: Unified, Promise-based wrapper for WebExtension storage (chrome.storage / browser.storage).
 */

/**
 * Detect extension storage runtime.
 * Supports both `browser.storage` (W3C / Firefox) and `chrome.storage` (Chromium).
 * @param {'local'|'sync'|'session'|'managed'} area
 * @returns {any}
 */
const getStorageArea = (area = 'local') => {
  if (typeof globalThis !== 'undefined') {
    if (globalThis.browser && globalThis.browser.storage && globalThis.browser.storage[area]) {
      return { api: globalThis.browser.storage[area], isW3C: true };
    }
    if (globalThis.chrome && globalThis.chrome.storage && globalThis.chrome.storage[area]) {
      return { api: globalThis.chrome.storage[area], isW3C: false };
    }
  }
  return null;
};

const resolveSingleKey = (result, key) => {
  if (result && Object.prototype.hasOwnProperty.call(result, key) && result[key] !== undefined) {
    return result[key];
  }
  return null;
};

export class LocalExtensionStorage {
  /**
   * @param {'local'|'sync'|'session'|'managed'} [area='local']
   */
  constructor(area = 'local') {
    this.area = area;
  }

  /**
   * Check if extension storage is available in the current runtime environment.
   * @returns {boolean}
   */
  isAvailable() {
    return Boolean(getStorageArea(this.area));
  }

  /**
   * Internal helper to resolve storage area API.
   * @private
   */
  _getArea() {
    const areaInstance = getStorageArea(this.area);
    if (!areaInstance) {
      throw new Error(`[local-storage-browser] Extension storage area "${this.area}" is not available in this environment.`);
    }
    return areaInstance;
  }

  /**
   * Get item(s) from extension storage.
   * If a single string key is provided, returns the value directly.
   * If an array of keys or null is provided, returns the key-value dictionary object.
   * @template T
   * @param {string|string[]|null} [keys=null]
   * @returns {Promise<T|Record<string, any>|null>}
   */
  async get(keys = null) {
    if (!this.isAvailable()) return null;

    try {
      const { api } = this._getArea();

      return new Promise((resolve, reject) => {
        let isHandled = false;

        const handleResult = (result) => {
          if (isHandled) return;
          isHandled = true;

          if (globalThis.chrome?.runtime?.lastError) {
            reject(globalThis.chrome.runtime.lastError);
          } else {
            if (typeof keys === 'string') {
              resolve(resolveSingleKey(result, keys));
            } else {
              resolve(result || {});
            }
          }
        };

        const maybePromise = api.get(keys, handleResult);

        if (maybePromise && typeof maybePromise.then === 'function') {
          maybePromise
            .then((result) => handleResult(result))
            .catch(reject);
        }
      });
    } catch (error) {
      console.warn(`[local-storage-browser] Extension storage get error:`, error);
      return null;
    }
  }

  /**
   * Set item(s) in extension storage.
   * Can accept either (key, value) or an object dictionary { [key]: value }.
   * @param {string|Record<string, any>} keyOrObject
   * @param {any} [value]
   * @returns {Promise<boolean>}
   */
  async set(keyOrObject, value) {
    if (!this.isAvailable()) return false;

    let items;
    if (typeof keyOrObject === 'string') {
      items = { [keyOrObject]: value };
    } else if (typeof keyOrObject === 'object' && keyOrObject !== null) {
      items = keyOrObject;
    } else {
      return false;
    }

    try {
      const { api } = this._getArea();

      return new Promise((resolve, reject) => {
        let isHandled = false;

        const handleComplete = () => {
          if (isHandled) return;
          isHandled = true;

          if (globalThis.chrome?.runtime?.lastError) {
            reject(globalThis.chrome.runtime.lastError);
          } else {
            resolve(true);
          }
        };

        const maybePromise = api.set(items, handleComplete);

        if (maybePromise && typeof maybePromise.then === 'function') {
          maybePromise.then(() => handleComplete()).catch(reject);
        }
      });
    } catch (error) {
      console.warn(`[local-storage-browser] Extension storage set error:`, error);
      return false;
    }
  }

  /**
   * Remove item(s) from extension storage.
   * @param {string|string[]} keys
   * @returns {Promise<boolean>}
   */
  async remove(keys) {
    if (!this.isAvailable()) return false;

    try {
      const { api } = this._getArea();

      return new Promise((resolve, reject) => {
        let isHandled = false;

        const handleComplete = () => {
          if (isHandled) return;
          isHandled = true;

          if (globalThis.chrome?.runtime?.lastError) {
            reject(globalThis.chrome.runtime.lastError);
          } else {
            resolve(true);
          }
        };

        const maybePromise = api.remove(keys, handleComplete);

        if (maybePromise && typeof maybePromise.then === 'function') {
          maybePromise.then(() => handleComplete()).catch(reject);
        }
      });
    } catch (error) {
      console.warn(`[local-storage-browser] Extension storage remove error:`, error);
      return false;
    }
  }

  /**
   * Clear all items in this extension storage area.
   * @returns {Promise<boolean>}
   */
  async clear() {
    if (!this.isAvailable()) return false;

    try {
      const { api } = this._getArea();

      return new Promise((resolve, reject) => {
        let isHandled = false;

        const handleComplete = () => {
          if (isHandled) return;
          isHandled = true;

          if (globalThis.chrome?.runtime?.lastError) {
            reject(globalThis.chrome.runtime.lastError);
          } else {
            resolve(true);
          }
        };

        const maybePromise = api.clear(handleComplete);

        if (maybePromise && typeof maybePromise.then === 'function') {
          maybePromise.then(() => handleComplete()).catch(reject);
        }
      });
    } catch (error) {
      console.warn(`[local-storage-browser] Extension storage clear error:`, error);
      return false;
    }
  }

  /**
   * Alias for clear() to maintain uniform naming with other storages.
   * @returns {Promise<boolean>}
   */
  async clearAll() {
    return this.clear();
  }

  /**
   * Check if a key exists in storage.
   * @param {string} key
   * @returns {Promise<boolean>}
   */
  async has(key) {
    const val = await this.get(key);
    return val !== null;
  }

  /**
   * Get all keys stored in this storage area.
   * @returns {Promise<string[]>}
   */
  async keys() {
    const all = await this.get(null);
    return all ? Object.keys(all) : [];
  }

  /**
   * Get byte quota in use for key(s) or whole storage area.
   * @param {string|string[]|null} [keys=null]
   * @returns {Promise<number>}
   */
  async getBytesInUse(keys = null) {
    if (!this.isAvailable()) return 0;

    try {
      const { api } = this._getArea();
      if (typeof api.getBytesInUse !== 'function') {
        return 0;
      }

      return new Promise((resolve, reject) => {
        let isHandled = false;

        const handleComplete = (bytes) => {
          if (isHandled) return;
          isHandled = true;

          if (globalThis.chrome?.runtime?.lastError) {
            reject(globalThis.chrome.runtime.lastError);
          } else {
            resolve(bytes || 0);
          }
        };

        const maybePromise = api.getBytesInUse(keys, handleComplete);

        if (maybePromise && typeof maybePromise.then === 'function') {
          maybePromise.then((bytes) => handleComplete(bytes)).catch(reject);
        }
      });
    } catch {
      return 0;
    }
  }

  /**
   * Watch for storage changes in this area.
   * Returns an unwatch function to cleanly detach the listener.
   * @param {(changes: Record<string, { oldValue?: any, newValue?: any }>, areaName: string) => void} callback
   * @returns {() => void} Function to unsubscribe the listener.
   */
  watch(callback) {
    const onChanged = globalThis.browser?.storage?.onChanged || globalThis.chrome?.storage?.onChanged;
    if (!onChanged || typeof onChanged.addListener !== 'function') {
      return () => {};
    }

    const listener = (changes, areaName) => {
      if (areaName === this.area) {
        callback(changes, areaName);
      }
    };

    onChanged.addListener(listener);

    return () => {
      if (typeof onChanged.removeListener === 'function') {
        onChanged.removeListener(listener);
      }
    };
  }
}
