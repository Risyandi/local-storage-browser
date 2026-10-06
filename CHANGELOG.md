# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-10-06

### 🚀 Added
- **`LocalIndexedDB`**: Promise-based, asynchronous wrapper around the native browser `IndexedDB` API.
  - Supports CRUD operations: `get()`, `set()`, `remove()`, `clear()`, `clearAll()`.
  - Batch queries and inspection: `keys()`, `getAll()`, `entries()`, `count()`, `length()`, `has()`.
  - Connection lifecycle management: connection pooling, `close()`, and `deleteDatabase()`.
- **`LocalExtensionStorage`**: Unified WebExtension storage utility for browser extensions.
  - Automatic runtime detection for both Chromium (`chrome.storage`) and Firefox/W3C (`browser.storage`).
  - Supports multiple storage areas: `'local'`, `'sync'`, `'session'`, and `'managed'`.
  - Added quota tracking helper `getBytesInUse()`.
  - Added reactive change listener `watch()` with returned clean `unwatch()` unsubscribe function.
- **TypeScript Support**: Native type declaration file (`index.d.ts`) supporting generic typing (`<T>`) for type-safe data access.
- **JSON Convenience Helpers**: Added `getJSON<T>()` and `setJSON()` methods to both `LocalStorage` and `LocalSessionStorage`.
- **Inspection Utilities**: Added `.has()` and `.keys()` methods to `LocalStorage`, `LocalSessionStorage`, and `LocalCookiesStorage`.
- **Modern Cookie Options**: Extended `LocalCookiesStorage.set()` to accept configuration objects with `days`, `path`, `domain`, `secure`, and `sameSite` ('Strict' | 'Lax' | 'None').
- **Automated Test Suite**: Added comprehensive test coverage using Node.js native test runner (`node:test`) covering all storage utilities and SSR safety.

### 🔄 Changed
- **Standardized Storage Iteration**: `keys()` in `LocalStorage` and `LocalSessionStorage` now iterates using standard W3C `storage.key(i)` to ensure 100% cross-browser and mock compatibility.
- **Modernized String Methods**: Replaced deprecated `String.prototype.substr()` with `substring()` in `LocalCookiesStorage`.
- **Cookie Parsing Bugfix**: Fixed issue where empty `document.cookie` returned `[""]` instead of empty array `[]`.
- **Module Packaging**: Configured package for ES Modules (`"type": "module"`), `"types": "./index.d.ts"`, and modern `"exports"` mapping in `package.json`.
- **Documentation**: Completely overhauled `README.md` with npm badges, storage decision matrix, quick start guides, and detailed how-to examples.
- **Attribution & Credits**: Updated standardized comment credit headers across all code and test files.

### 🛡️ Security & Resilience
- **SSR Safety**: Added environment checks across all modules to prevent `window is not defined` and `document is not defined` errors in Next.js, Nuxt, Remix, Astro, and SvelteKit.
- **Defensive Error Handling**: Wrapped storage calls with `try/catch` to gracefully handle Safari *Private Browsing* exceptions, restricted iframe contexts, and `QuotaExceededError`.
- **100% Backward Compatibility**: Maintained existing function signatures and behaviors without introducing breaking changes or deprecation warnings.

---

## [1.0.4] - 2025-01-10
### Added
- Added `LocalCookiesStorage` for managing browser cookies with expiration days.
- Added funding configuration and updated documentation.

---

## [1.0.3] - 2022-11-20
### Added
- Added `LocalSessionStorage` for handling tab-scoped session storage.

---

## [1.0.2] - 2022-08-15
### Changed
- Minor bug fixes and improvements in localStorage wrappers.

---

## [1.0.1] - 2022-06-10
### Fixed
- Fixed module export paths and documentation examples.

---

## [1.0.0] - 2022-05-01
### Added
- Initial release of `local-storage-browser`.
- Support for HTML5 `LocalStorage` basic API (`get`, `set`, `remove`, `clearAll`, `length`, `key`).
