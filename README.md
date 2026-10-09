# Local Storage Browser

<p align="center">
  <a href="https://github.com/risyandi/local-storage-browser">
    <img src="https://raw.githubusercontent.com/Risyandi/local-storage-browser/refs/heads/main/assets/local-storage-browser.jpg" alt="PolylinAI Logo" width="460" />
  </a>
</p>

<p align="center">
  <strong>A modern, zero-dependency browser storage library for JavaScript and TypeScript.</strong><br>
  Unified and resilient interface for <code>LocalStorage</code>, <code>SessionStorage</code>, <code>Cookies</code>, <code>IndexedDB</code>, and <code>WebExtension Storage</code>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/local-storage-browser"><img src="https://img.shields.io/npm/v/local-storage-browser.svg?style=flat-square&color=blue" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/local-storage-browser"><img src="https://img.shields.io/npm/dm/local-storage-browser.svg?style=flat-square&color=success" alt="npm downloads" /></a>
  <a href="https://bundlephobia.com/package/local-storage-browser"><img src="https://img.shields.io/bundlephobia/minzip/local-storage-browser?style=flat-square&label=minzipped" alt="bundle size" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/local-storage-browser.svg?style=flat-square&color=informational" alt="license" /></a>
  <img src="https://img.shields.io/badge/types-TypeScript-blue?style=flat-square" alt="TypeScript ready" />
  <img src="https://img.shields.io/badge/dependencies-0-brightgreen?style=flat-square" alt="zero dependencies" />
</p>

---

Does polylinai work in Node.js, Bun and Deno?  
Report link npm compatibility by **compatlab.me** [Check Report](https://compatlab.me/reports/414f851c-9693-4786-85c2-b30d8827142a)

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Storage Selection Guide](#-storage-selection-guide)
- [How-To Guide](#-how-to-guide)
  - [1. LocalStorage](#1-localstorage)
  - [2. LocalSessionStorage](#2-localsessionstorage)
  - [3. LocalCookiesStorage](#3-localcookiesstorage)
  - [4. LocalIndexedDB](#4-localindexeddb-new)
  - [5. LocalExtensionStorage](#5-localextensionstorage-new)
- [SSR & Framework Resilience](#-ssr--framework-resilience)
- [TypeScript Support](#-typescript-support)
- [Backward Compatibility Guarantee](#-backward-compatibility-guarantee)
- [Running Tests](#-running-tests)
- [License](#-license)

---

## ✨ Key Features

- ⚡ **Zero Dependencies**: Ultra lightweight with minimal footprint.
- 🛡️ **SSR & Framework Safe**: Built-in environment guards prevent `window is not defined` errors in Next.js, Nuxt, Remix, Astro, and SvelteKit.
- 🗄️ **Full Browser Storage Coverage**:
  - **LocalStorage & SessionStorage**: Synchronous key-value access with safe JSON serialization.
  - **LocalCookiesStorage**: Flexible cookie management with expiration days, `SameSite`, and `Secure` attributes.
  - **LocalIndexedDB**: Clean, Promise-based async wrapper for large datasets, blobs, and offline state.
  - **LocalExtensionStorage**: Unified interface across Chrome (`chrome.storage`) and Firefox/Safari (`browser.storage`).
- 🔒 **Defensive Error Handling**: Catches Safari *Private Browsing* exceptions, quota overflow warnings, and blocked access without crashing your application.
- 📘 **TypeScript Ready**: Bundled with comprehensive `.d.ts` definitions and generic typing support (`<T>`).
- 🔄 **100% Backward Compatible**: Safe upgrade path with zero breaking changes for existing v1.x users.

---

## 📦 Installation

Install using your package manager of choice:

```bash
# npm
npm install local-storage-browser

# pnpm
pnpm add local-storage-browser

# yarn
yarn add local-storage-browser

# bun
bun add local-storage-browser
```

---

## 🚀 Quick Start

```javascript
import { 
  LocalStorage, 
  LocalCookiesStorage, 
  LocalIndexedDB 
} from 'local-storage-browser';

// 1. Simple synchronous LocalStorage
LocalStorage.set('theme', 'dark');
console.log(LocalStorage.get('theme')); // 'dark'

// 2. Cookie with expiration and security options
LocalCookiesStorage.set('session_id', 'xyz-789', { 
  days: 14, 
  secure: true, 
  sameSite: 'Lax' 
});

// 3. High-capacity, asynchronous IndexedDB
const db = new LocalIndexedDB({ dbName: 'AppDB', storeName: 'cache' });
await db.set('userData', { id: 101, name: 'Alice' });
const user = await db.get('userData');
console.log(user); // { id: 101, name: 'Alice' }
```

---

## 📊 Storage Selection Guide

Choose the best storage mechanism for your application's needs:

| Storage Type | Execution | Typical Capacity | Persistence | Best Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **LocalStorage** | Synchronous | ~5 MB | Indefinite | User settings, theme preferences, small state |
| **LocalSessionStorage** | Synchronous | ~5 MB | Tab Session | Checkout wizards, multistep forms, session cache |
| **LocalCookiesStorage** | Synchronous | ~4 KB | Configurable | Server/Client shared session tokens, auth cookies |
| **LocalIndexedDB** | Asynchronous (Promise) | >1 GB (Disk Quota) | Indefinite | Offline database, heavy datasets, files, blobs |
| **LocalExtensionStorage** | Asynchronous (Promise) | 10 MB+ / Quota | Extension Lifecycle | Browser Extensions (`sync`, `local`, `session`) |

---

## 📖 How-To Guide

### 1. LocalStorage

The `LocalStorage` module provides safe access to HTML5 `localStorage` with automated error handling and JSON convenience helpers.

```javascript
import { LocalStorage } from 'local-storage-browser';

// Basic CRUD
LocalStorage.set('username', 'risyandi');
const username = LocalStorage.get('username'); // 'risyandi'
LocalStorage.remove('username');
LocalStorage.clearAll();

// Safe JSON serialization
LocalStorage.setJSON('userProfile', { name: 'Risyandi', role: 'admin' });
const profile = LocalStorage.getJSON('userProfile', /* fallback */ null);

// Inspection helpers
LocalStorage.has('username'); // true | false
LocalStorage.length();        // Total number of stored keys
LocalStorage.keys();          // Array of all stored key names: ['userProfile', ...]
LocalStorage.key(0);          // Key name at index 0
```

---

### 2. LocalSessionStorage

The `LocalSessionStorage` module operates identically to `LocalStorage`, but data is scoped strictly to the current browser tab and cleared when the tab closes.

```javascript
import { LocalSessionStorage } from 'local-storage-browser';

// Save transient session data
LocalSessionStorage.set('draftStep', '2');
const step = LocalSessionStorage.get('draftStep');

// JSON data
LocalSessionStorage.setJSON('tempFilter', { category: 'tech', sort: 'desc' });
const filter = LocalSessionStorage.getJSON('tempFilter');

// Inspection & Cleanup
LocalSessionStorage.has('draftStep'); // true
LocalSessionStorage.remove('draftStep');
LocalSessionStorage.clearAll();
```

---

### 3. LocalCookiesStorage

The `LocalCookiesStorage` module simplifies document cookie manipulation without manual string parsing.

```javascript
import { LocalCookiesStorage } from 'local-storage-browser';

// Set cookie (default expires in 7 days, path='/')
LocalCookiesStorage.set('consent', 'true');

// Set cookie with custom expiration days
LocalCookiesStorage.set('visited', 'true', 30); // 30 days

// Set cookie with full security configuration
LocalCookiesStorage.set('authToken', 'token_xyz', {
  days: 14,
  path: '/',
  domain: window.location.hostname,
  secure: true,
  sameSite: 'Strict' // 'Strict' | 'Lax' | 'None'
});

// Read cookie
const token = LocalCookiesStorage.get('authToken');

// Check presence & list all cookie names
LocalCookiesStorage.has('authToken'); // true
const allCookieNames = LocalCookiesStorage.keys(); // ['consent', 'visited', 'authToken']

// Remove single cookie
LocalCookiesStorage.remove('consent', { path: '/' });

// Clear all accessible cookies
LocalCookiesStorage.clearAll();
```

---

### 4. LocalIndexedDB *(New)*

A zero-boilerplate, Promise-based wrapper around browser `IndexedDB`. Eliminates the need for manual event listeners (`onsuccess`, `onerror`, `onupgradeneeded`) and transaction management.

```javascript
import { LocalIndexedDB } from 'local-storage-browser';

// 1. Initialize store instance
const db = new LocalIndexedDB({
  dbName: 'MyAppDB',       // Default: 'local_storage_db'
  storeName: 'documents',  // Default: 'key_value_store'
  version: 1               // Default: 1
});

// 2. Write & Read
await db.set('doc_001', { title: 'Architecture Plan', tags: ['eng', 'v2'] });
const doc = await db.get('doc_001');

// 3. Query existence & count
const exists = await db.has('doc_001'); // true
const totalDocs = await db.count();     // or await db.length()

// 4. Batch inspection
const allKeys = await db.keys();        // ['doc_001', ...]
const allDocs = await db.getAll();      // [{ title: 'Architecture Plan', ... }]
const entries = await db.entries();     // [['doc_001', { ... }]]

// 5. Deletion & Cleanup
await db.remove('doc_001');
await db.clear();                       // or await db.clearAll()

// 6. Connection management
db.close();                             // Close active connection
await db.deleteDatabase();             // Permanently remove the database
```

---

### 5. LocalExtensionStorage *(New)*

Purpose-built for browser extensions (Chrome, Edge, Firefox, Safari, Brave, Opera). Seamlessly bridges differences between Manifest V2 and Manifest V3, and unifies `chrome.storage` with `browser.storage`.

```javascript
import { LocalExtensionStorage } from 'local-storage-browser';

// Choose storage area: 'local' (default), 'sync', 'session', or 'managed'
const extSync = new LocalExtensionStorage('sync');
const extLocal = new LocalExtensionStorage('local');

// Verify environment availability (useful in shared web/extension codebases)
if (extSync.isAvailable()) {
  // Set item(s) - accepts (key, value) or an object
  await extSync.set('userSettings', { theme: 'dark', autoSave: true });

  // Get item
  const settings = await extSync.get('userSettings');

  // Monitor storage quota usage (in bytes)
  const bytes = await extSync.getBytesInUse('userSettings');
  console.log(`Used bytes: ${bytes}`);

  // Reactive listener for storage updates
  // Automatically unsubscribes when calling the returned function
  const unwatch = extSync.watch((changes, areaName) => {
    console.log(`Changes detected in ${areaName}:`, changes);
  });

  // Stop listening when no longer needed
  unwatch();

  // Removal
  await extSync.remove('userSettings');
  await extSync.clear();
}
```

---

## 🛡️ SSR & Framework Resilience

Frameworks like **Next.js (App & Pages Router)**, **Nuxt 3**, **Remix**, and **SvelteKit** execute code on both the server (Node.js/Edge) and the client.

Direct access to `localStorage` or `document` during server rendering causes runtime crashes:
```
ReferenceError: window is not defined
ReferenceError: document is not defined
```

**`local-storage-browser`** prevents this by safely guarding all storage access:
- When executed on the server, read operations safely return `null` and write operations safely return `false`.
- No need to clutter your components with `typeof window !== 'undefined'` checks.

---

## 📘 TypeScript Support

Fully typed declarations are included in the package (`index.d.ts`). You can leverage generics for type-safe reads:

```typescript
import { LocalStorage, LocalIndexedDB } from 'local-storage-browser';

interface UserAccount {
  id: string;
  displayName: string;
  verified: boolean;
}

// Type-safe JSON retrieval from LocalStorage
const user = LocalStorage.getJSON<UserAccount>('account');
if (user) {
  console.log(user.displayName);
}

// Type-safe reads from LocalIndexedDB
const db = new LocalIndexedDB({ dbName: 'CoreDB', storeName: 'accounts' });
const account = await db.get<UserAccount>('acc_42');
```

---

## 🔄 Backward Compatibility Guarantee

If you are upgrading from `local-storage-browser` **v1.0.x**:
- All existing signatures (`LocalStorage.get`, `LocalStorage.set`, `LocalCookiesStorage.set`, etc.) are **100% backward compatible**.
- No breaking changes or deprecated warnings have been introduced.
- Existing projects can update directly without code modifications.

---

## 🧪 Running Tests

The library includes an automated unit test suite with zero external dependencies, powered by Node's native test runner:

```bash
npm test
```

---

## 😎Credits & Author

Created by **Risyandi** in collaboration with AI.  
Contact: [hello@risyandi.com](mailto:hello@risyandi.com)

## 🪪 License

[MIT](LICENSE) © 2026 Risyandi