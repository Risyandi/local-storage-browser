/**
 * Created by Risyandi in collaboration with AI.
 * Contact: hello@risyandi.com
 * Licensed under the MIT License
 * Automated tests for LocalStorage, LocalSessionStorage, LocalCookiesStorage, LocalExtensionStorage, and SSR safety.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  LocalStorage,
  LocalSessionStorage,
  LocalCookiesStorage,
  LocalIndexedDB,
  LocalExtensionStorage
} from '../index.js';

// Setup Mock Storage for LocalStorage & SessionStorage
class StorageMock {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
  key(index) {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
  get length() {
    return Object.keys(this.store).length;
  }
}

test('LocalStorage: operations & backward compatibility', () => {
  globalThis.window = {
    localStorage: new StorageMock()
  };

  // set & get string
  assert.strictEqual(LocalStorage.set('username', 'risyandi'), true);
  assert.strictEqual(LocalStorage.get('username'), 'risyandi');
  assert.strictEqual(LocalStorage.has('username'), true);

  // JSON operations
  const profile = { id: 1, role: 'admin' };
  assert.strictEqual(LocalStorage.setJSON('profile', profile), true);
  assert.deepStrictEqual(LocalStorage.getJSON('profile'), profile);

  // length & key
  assert.strictEqual(LocalStorage.length(), 2);
  assert.ok(LocalStorage.keys().includes('username'));
  assert.ok(LocalStorage.keys().includes('profile'));

  // remove
  assert.strictEqual(LocalStorage.remove('username'), true);
  assert.strictEqual(LocalStorage.get('username'), null);
  assert.strictEqual(LocalStorage.has('username'), false);

  // clearAll
  assert.strictEqual(LocalStorage.clearAll(), true);
  assert.strictEqual(LocalStorage.length(), 0);
});

test('LocalSessionStorage: operations & backward compatibility', () => {
  globalThis.window = {
    sessionStorage: new StorageMock()
  };

  assert.strictEqual(LocalSessionStorage.set('sessionKey', 'active'), true);
  assert.strictEqual(LocalSessionStorage.get('sessionKey'), 'active');
  assert.strictEqual(LocalSessionStorage.has('sessionKey'), true);

  const payload = { token: 'xyz123' };
  assert.strictEqual(LocalSessionStorage.setJSON('auth', payload), true);
  assert.deepStrictEqual(LocalSessionStorage.getJSON('auth'), payload);

  assert.strictEqual(LocalSessionStorage.length(), 2);
  assert.strictEqual(LocalSessionStorage.remove('sessionKey'), true);
  assert.strictEqual(LocalSessionStorage.get('sessionKey'), null);

  assert.strictEqual(LocalSessionStorage.clearAll(), true);
  assert.strictEqual(LocalSessionStorage.length(), 0);
});

test('LocalCookiesStorage: operations, parsing & options', () => {
  let cookieJar = '';
  globalThis.document = {
    get cookie() {
      return cookieJar;
    },
    set cookie(val) {
      const parts = val.split(';');
      const [nameVal] = parts;
      const [k, v] = nameVal.split('=');
      const key = k.trim();
      const value = v ? v.trim() : '';

      // if expires in past, remove
      if (val.includes('Thu, 01 Jan 1970')) {
        const existing = cookieJar.split(';').map(s => s.trim()).filter(Boolean);
        cookieJar = existing.filter(c => !c.startsWith(`${key}=`)).join('; ');
      } else {
        const existing = cookieJar.split(';').map(s => s.trim()).filter(Boolean);
        const filtered = existing.filter(c => !c.startsWith(`${key}=`));
        filtered.push(`${key}=${value}`);
        cookieJar = filtered.join('; ');
      }
    }
  };

  assert.strictEqual(LocalCookiesStorage.set('token', 'abc_123', 7), true);
  assert.strictEqual(LocalCookiesStorage.get('token'), 'abc_123');
  assert.strictEqual(LocalCookiesStorage.has('token'), true);

  // Test options object
  assert.strictEqual(LocalCookiesStorage.set('pref', 'dark', { days: 30, sameSite: 'Lax', secure: true }), true);
  assert.strictEqual(LocalCookiesStorage.get('pref'), 'dark');

  const keys = LocalCookiesStorage.keys();
  assert.ok(keys.includes('token'));
  assert.ok(keys.includes('pref'));

  assert.strictEqual(LocalCookiesStorage.remove('token'), true);
  assert.strictEqual(LocalCookiesStorage.get('token'), null);

  assert.strictEqual(LocalCookiesStorage.clearAll(), true);
  assert.strictEqual(LocalCookiesStorage.keys().length, 0);
});

test('LocalExtensionStorage: operations & area switching', async () => {
  const mockStorageData = {};
  const listeners = [];

  globalThis.chrome = {
    storage: {
      sync: {
        get(keys, cb) {
          if (typeof keys === 'string') {
            cb({ [keys]: mockStorageData[keys] });
          } else if (Array.isArray(keys)) {
            const res = {};
            keys.forEach(k => { res[k] = mockStorageData[k]; });
            cb(res);
          } else {
            cb({ ...mockStorageData });
          }
        },
        set(items, cb) {
          Object.assign(mockStorageData, items);
          if (cb) cb();
        },
        remove(keys, cb) {
          const list = Array.isArray(keys) ? keys : [keys];
          list.forEach(k => delete mockStorageData[k]);
          if (cb) cb();
        },
        clear(cb) {
          Object.keys(mockStorageData).forEach(k => delete mockStorageData[k]);
          if (cb) cb();
        },
        getBytesInUse(keys, cb) {
          cb(128);
        }
      },
      onChanged: {
        addListener(fn) {
          listeners.push(fn);
        },
        removeListener(fn) {
          const idx = listeners.indexOf(fn);
          if (idx !== -1) listeners.splice(idx, 1);
        }
      }
    }
  };

  const ext = new LocalExtensionStorage('sync');
  assert.strictEqual(ext.isAvailable(), true);

  // set & get
  const setSuccess = await ext.set('theme', 'dark');
  assert.strictEqual(setSuccess, true);

  const theme = await ext.get('theme');
  assert.strictEqual(theme, 'dark');

  const hasKey = await ext.has('theme');
  assert.strictEqual(hasKey, true);

  const bytes = await ext.getBytesInUse();
  assert.strictEqual(bytes, 128);

  // watch listener
  let changeNotified = false;
  const unwatch = ext.watch((changes, area) => {
    if (area === 'sync') changeNotified = true;
  });
  listeners.forEach(fn => fn({ theme: { newValue: 'light' } }, 'sync'));
  assert.strictEqual(changeNotified, true);
  unwatch();
  assert.strictEqual(listeners.length, 0);

  // remove & clear
  await ext.remove('theme');
  const removedVal = await ext.get('theme');
  assert.strictEqual(removedVal, null);
});

test('SSR Safety: functions do not throw in non-browser environments', async () => {
  // Clear globals
  delete globalThis.window;
  delete globalThis.document;
  delete globalThis.chrome;
  delete globalThis.browser;

  // LocalStorage SSR safe
  assert.strictEqual(LocalStorage.get('test'), null);
  assert.strictEqual(LocalStorage.set('test', '123'), false);
  assert.strictEqual(LocalStorage.remove('test'), false);
  assert.strictEqual(LocalStorage.clearAll(), false);
  assert.strictEqual(LocalStorage.length(), 0);
  assert.deepStrictEqual(LocalStorage.keys(), []);

  // LocalSessionStorage SSR safe
  assert.strictEqual(LocalSessionStorage.get('test'), null);
  assert.strictEqual(LocalSessionStorage.set('test', '123'), false);
  assert.strictEqual(LocalSessionStorage.length(), 0);

  // LocalCookiesStorage SSR safe
  assert.strictEqual(LocalCookiesStorage.get('test'), null);
  assert.strictEqual(LocalCookiesStorage.set('test', '123'), false);
  assert.deepStrictEqual(LocalCookiesStorage.keys(), []);

  // LocalExtensionStorage SSR safe
  const ext = new LocalExtensionStorage('local');
  assert.strictEqual(ext.isAvailable(), false);
  assert.strictEqual(await ext.get('test'), null);
  assert.strictEqual(await ext.set('test', '123'), false);
});
