/**
 * Created by Risyandi in collaboration with AI.
 * Contact: hello@risyandi.com
 * Licensed under the MIT License
 * LocalIndexedDB: Promise-based asynchronous wrapper for the browser's IndexedDB API.
 */

const isIDBAvailable = () => {
  return (
    typeof window !== 'undefined' &&
    typeof window.indexedDB !== 'undefined' &&
    window.indexedDB !== null
  );
};

export class LocalIndexedDB {
  /**
   * @param {Object} [options]
   * @param {string} [options.dbName='local_storage_db']
   * @param {string} [options.storeName='key_value_store']
   * @param {number} [options.version=1]
   */
  constructor({
    dbName = 'local_storage_db',
    storeName = 'key_value_store',
    version = 1
  } = {}) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.version = version;
    /** @type {IDBDatabase|null} */
    this._db = null;
    /** @type {Promise<IDBDatabase>|null} */
    this._initPromise = null;
  }

  /**
   * Internal helper to open or reuse an IDBDatabase connection.
   * @private
   * @returns {Promise<IDBDatabase>}
   */
  async _getDB() {
    if (!isIDBAvailable()) {
      throw new Error('[local-storage-browser] IndexedDB is not supported or not available in this environment.');
    }

    if (this._db) {
      return this._db;
    }

    if (this._initPromise) {
      return this._initPromise;
    }

    this._initPromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event) => {
        /** @type {IDBDatabase} */
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };

      request.onsuccess = (event) => {
        this._db = event.target.result;
        this._db.onversionchange = () => {
          this._db.close();
          this._db = null;
          this._initPromise = null;
        };
        this._db.onclose = () => {
          this._db = null;
          this._initPromise = null;
        };
        resolve(this._db);
      };

      request.onerror = (event) => {
        this._initPromise = null;
        reject(event.target.error || new Error('Failed to open IndexedDB database.'));
      };

      request.onblocked = () => {
        console.warn(`[local-storage-browser] Database open request blocked for "${this.dbName}".`);
      };
    });

    return this._initPromise;
  }

  /**
   * Execute an operation within an IDB transaction.
   * @private
   * @template T
   * @param {'readonly'|'readwrite'} mode
   * @param {(store: IDBObjectStore) => IDBRequest} operation
   * @returns {Promise<T>}
   */
  async _execute(mode, operation) {
    const db = await this._getDB();
    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(this.storeName, mode);
        const store = tx.objectStore(this.storeName);
        const request = operation(store);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        tx.onerror = () => reject(tx.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Get an item from the IndexedDB store by key.
   * @template T
   * @param {string|number} key
   * @returns {Promise<T|null>}
   */
  async get(key) {
    try {
      const result = await this._execute('readonly', (store) => store.get(key));
      return result !== undefined ? result : null;
    } catch (error) {
      console.warn(`[local-storage-browser] LocalIndexedDB get error for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Set or update an item in the IndexedDB store.
   * @param {string|number} key
   * @param {any} value
   * @returns {Promise<boolean>}
   */
  async set(key, value) {
    try {
      await this._execute('readwrite', (store) => store.put(value, key));
      return true;
    } catch (error) {
      console.warn(`[local-storage-browser] LocalIndexedDB set error for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Remove an item from the IndexedDB store by key.
   * @param {string|number} key
   * @returns {Promise<boolean>}
   */
  async remove(key) {
    try {
      await this._execute('readwrite', (store) => store.delete(key));
      return true;
    } catch (error) {
      console.warn(`[local-storage-browser] LocalIndexedDB remove error for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Clear all items in the IndexedDB store.
   * @returns {Promise<boolean>}
   */
  async clear() {
    try {
      await this._execute('readwrite', (store) => store.clear());
      return true;
    } catch (error) {
      console.warn('[local-storage-browser] LocalIndexedDB clear error:', error);
      return false;
    }
  }

  /**
   * Alias for clear() to maintain consistency with LocalStorage / LocalCookiesStorage.
   * @returns {Promise<boolean>}
   */
  async clearAll() {
    return this.clear();
  }

  /**
   * Check if a key exists in the store.
   * @param {string|number} key
   * @returns {Promise<boolean>}
   */
  async has(key) {
    try {
      const count = await this._execute('readonly', (store) => store.count(key));
      return count > 0;
    } catch {
      return false;
    }
  }

  /**
   * Get all keys in the store.
   * @returns {Promise<Array<string|number>>}
   */
  async keys() {
    try {
      const result = await this._execute('readonly', (store) => store.getAllKeys());
      return result || [];
    } catch (error) {
      console.warn('[local-storage-browser] LocalIndexedDB keys error:', error);
      return [];
    }
  }

  /**
   * Get all values in the store.
   * @template T
   * @returns {Promise<T[]>}
   */
  async getAll() {
    try {
      const result = await this._execute('readonly', (store) => store.getAll());
      return result || [];
    } catch (error) {
      console.warn('[local-storage-browser] LocalIndexedDB getAll error:', error);
      return [];
    }
  }

  /**
   * Get all entries as an array of [key, value] pairs.
   * @returns {Promise<Array<[string|number, any]>>}
   */
  async entries() {
    try {
      const db = await this._getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const entries = [];

        const request = store.openCursor();
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            entries.push([cursor.key, cursor.value]);
            cursor.continue();
          } else {
            resolve(entries);
          }
        };
        request.onerror = () => reject(request.error);
        tx.onerror = () => reject(tx.error);
      });
    } catch (error) {
      console.warn('[local-storage-browser] LocalIndexedDB entries error:', error);
      return [];
    }
  }

  /**
   * Count the number of items stored.
   * @returns {Promise<number>}
   */
  async count() {
    try {
      const result = await this._execute('readonly', (store) => store.count());
      return result || 0;
    } catch {
      return 0;
    }
  }

  /**
   * Alias for count() for consistency with LocalStorage.length().
   * @returns {Promise<number>}
   */
  async length() {
    return this.count();
  }

  /**
   * Close the active database connection.
   */
  close() {
    if (this._db) {
      this._db.close();
      this._db = null;
      this._initPromise = null;
    }
  }

  /**
   * Delete the database entirely.
   * @returns {Promise<boolean>}
   */
  async deleteDatabase() {
    this.close();
    if (!isIDBAvailable()) return false;
    return new Promise((resolve, reject) => {
      const req = window.indexedDB.deleteDatabase(this.dbName);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
      req.onblocked = () => {
        console.warn(`[local-storage-browser] Deletion blocked for database "${this.dbName}".`);
      };
    });
  }
}
