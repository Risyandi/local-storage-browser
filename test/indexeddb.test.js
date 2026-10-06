/**
 * Created by Risyandi in collaboration with AI.
 * Contact: hello@risyandi.com
 * Licensed under the MIT License
 * Automated tests for LocalIndexedDB CRUD operations, queries, and connection lifecycle.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { LocalIndexedDB } from '../index.js';

// Minimal in-memory Mock for IndexedDB API in Node environment
function createMockIndexedDB() {
  const databases = new Map();

  return {
    open(name, version) {
      const req = {
        result: null,
        error: null,
        onsuccess: null,
        onerror: null,
        onupgradeneeded: null,
        onblocked: null
      };

      setTimeout(() => {
        let dbRecord = databases.get(name);
        let isUpgradeNeeded = false;
        if (!dbRecord) {
          dbRecord = { stores: new Map() };
          databases.set(name, dbRecord);
          isUpgradeNeeded = true;
        }

        const dbInstance = {
          objectStoreNames: {
            contains(storeName) {
              return dbRecord.stores.has(storeName);
            }
          },
          createObjectStore(storeName) {
            dbRecord.stores.set(storeName, new Map());
          },
          transaction(storeName, mode) {
            const storeMap = dbRecord.stores.get(storeName);
            const tx = {
              error: null,
              onerror: null,
              objectStore() {
                return {
                  get(key) {
                    const r = { result: storeMap.get(key), error: null, onsuccess: null, onerror: null };
                    setTimeout(() => r.onsuccess && r.onsuccess(), 0);
                    return r;
                  },
                  put(val, key) {
                    storeMap.set(key, val);
                    const r = { result: key, error: null, onsuccess: null, onerror: null };
                    setTimeout(() => r.onsuccess && r.onsuccess(), 0);
                    return r;
                  },
                  delete(key) {
                    storeMap.delete(key);
                    const r = { result: undefined, error: null, onsuccess: null, onerror: null };
                    setTimeout(() => r.onsuccess && r.onsuccess(), 0);
                    return r;
                  },
                  clear() {
                    storeMap.clear();
                    const r = { result: undefined, error: null, onsuccess: null, onerror: null };
                    setTimeout(() => r.onsuccess && r.onsuccess(), 0);
                    return r;
                  },
                  count(key) {
                    const count = key !== undefined ? (storeMap.has(key) ? 1 : 0) : storeMap.size;
                    const r = { result: count, error: null, onsuccess: null, onerror: null };
                    setTimeout(() => r.onsuccess && r.onsuccess(), 0);
                    return r;
                  },
                  getAllKeys() {
                    const r = { result: Array.from(storeMap.keys()), error: null, onsuccess: null, onerror: null };
                    setTimeout(() => r.onsuccess && r.onsuccess(), 0);
                    return r;
                  },
                  getAll() {
                    const r = { result: Array.from(storeMap.values()), error: null, onsuccess: null, onerror: null };
                    setTimeout(() => r.onsuccess && r.onsuccess(), 0);
                    return r;
                  },
                  openCursor() {
                    const entries = Array.from(storeMap.entries());
                    let index = 0;
                    const r = {
                      result: null,
                      error: null,
                      onsuccess: null,
                      onerror: null
                    };

                    const advance = () => {
                      if (index < entries.length) {
                        const [key, value] = entries[index];
                        r.result = {
                          key,
                          value,
                          continue() {
                            index++;
                            advance();
                          }
                        };
                      } else {
                        r.result = null;
                      }
                      if (r.onsuccess) r.onsuccess({ target: r });
                    };

                    setTimeout(advance, 0);
                    return r;
                  }
                };
              }
            };
            return tx;
          },
          close() {}
        };

        if (isUpgradeNeeded && req.onupgradeneeded) {
          req.onupgradeneeded({ target: { result: dbInstance } });
        }

        req.result = dbInstance;
        if (req.onsuccess) {
          req.onsuccess({ target: req });
        }
      }, 0);

      return req;
    },
    deleteDatabase(name) {
      databases.delete(name);
      const req = { onsuccess: null, onerror: null };
      setTimeout(() => req.onsuccess && req.onsuccess(), 0);
      return req;
    }
  };
}

test('LocalIndexedDB: CRUD operations and queries', async () => {
  globalThis.window = {
    indexedDB: createMockIndexedDB()
  };

  const idb = new LocalIndexedDB({ dbName: 'test_db', storeName: 'users', version: 1 });

  // set
  const setOk = await idb.set('user:1', { name: 'Alice', age: 25 });
  assert.strictEqual(setOk, true);

  // get
  const user = await idb.get('user:1');
  assert.deepStrictEqual(user, { name: 'Alice', age: 25 });

  // has
  assert.strictEqual(await idb.has('user:1'), true);
  assert.strictEqual(await idb.has('user:99'), false);

  // set second item
  await idb.set('user:2', { name: 'Bob', age: 30 });

  // count / length
  assert.strictEqual(await idb.count(), 2);
  assert.strictEqual(await idb.length(), 2);

  // keys
  const keys = await idb.keys();
  assert.deepStrictEqual(keys, ['user:1', 'user:2']);

  // getAll
  const all = await idb.getAll();
  assert.strictEqual(all.length, 2);

  // entries
  const entries = await idb.entries();
  assert.strictEqual(entries.length, 2);
  assert.strictEqual(entries[0][0], 'user:1');

  // remove
  await idb.remove('user:1');
  assert.strictEqual(await idb.get('user:1'), null);
  assert.strictEqual(await idb.count(), 1);

  // clear
  await idb.clear();
  assert.strictEqual(await idb.count(), 0);

  // close & deleteDatabase
  idb.close();
  const deleted = await idb.deleteDatabase();
  assert.strictEqual(deleted, true);
});
