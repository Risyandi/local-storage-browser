# Release v1.1.0 — IndexedDB, WebExtension Storage, TypeScript & SSR Resilience

We are excited to release **`local-storage-browser` v1.1.0**! 🎉

This release expands the library from basic Web Storage into a comprehensive, multi-engine browser storage toolkit while maintaining **100% backward compatibility** with previous versions.

---

## 🌟 What's New in v1.1.0

### 1. 🗄️ `LocalIndexedDB` (Promise-based IndexedDB)
Work with browser `IndexedDB` using clean `async/await` syntax without dealing with raw event callbacks (`onsuccess`, `onerror`, `onupgradeneeded`):
- Full CRUD: `get()`, `set()`, `remove()`, `clear()`, `clearAll()`.
- Batch queries & metrics: `keys()`, `getAll()`, `entries()`, `count()`, `has()`.
- Connection pooling and lifecycle management (`close()`, `deleteDatabase()`).

```javascript
import { LocalIndexedDB } from 'local-storage-browser';

const db = new LocalIndexedDB({ dbName: 'AppDB', storeName: 'users' });
await db.set('user:101', { name: 'Alice', role: 'Engineer' });
const user = await db.get('user:101');
```

---

### 2. 🧩 `LocalExtensionStorage` (WebExtension Storage)
Built specifically for browser extension developers (Chrome, Edge, Firefox, Safari, Brave):
- Automatically resolves `chrome.storage` (Chromium) and `browser.storage` (Firefox/W3C).
- Supports all storage areas: `'local'`, `'sync'`, `'session'`, and `'managed'`.
- Quota tracking with `getBytesInUse()`.
- Reactive change listener `watch()` with returned clean `unwatch()` function.

```javascript
import { LocalExtensionStorage } from 'local-storage-browser';

const syncStorage = new LocalExtensionStorage('sync');
await syncStorage.set('settings', { darkTheme: true });
const settings = await syncStorage.get('settings');
```

---

### 3. 🛡️ SSR & Framework Resilience
- Built-in environment guards prevent `ReferenceError: window is not defined` or `document is not defined` crashes in **Next.js (App & Pages Router)**, **Nuxt 3**, **Remix**, **Astro**, and **SvelteKit**.
- Graceful exception handling for Safari *Private Browsing* mode and storage quota overflows.

---

### 4. 📘 First-Class TypeScript Typings (`index.d.ts`)
- Full IntelliSense auto-completion in VS Code and modern IDEs.
- Generic typing support for type-safe data reads:
  ```typescript
  const profile = LocalStorage.getJSON<UserProfile>('profile');
  const user = await db.get<UserProfile>('user:101');
  ```

---

### 5. ⚡ Enhanced Utilities for Existing Storages
- **`LocalStorage` & `LocalSessionStorage`**: Added `.getJSON()`, `.setJSON()`, `.has()`, and W3C-standard `.keys()`.
- **`LocalCookiesStorage`**: Replaced deprecated `.substr()`, fixed empty cookie parsing, and added support for advanced cookie options (`sameSite`, `secure`, `domain`, `path`).

---

## 🔄 Upgrading & Backward Compatibility
This release is **100% backward compatible** with `v1.0.x`. No code changes are required for existing projects.

To upgrade:
```bash
npm install local-storage-browser@latest
```
