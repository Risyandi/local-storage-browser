/**
 * Created by Risyandi in collaboration with AI.
 * Contact: hello@risyandi.com
 * Licensed under the MIT License
 * TypeScript definitions for local-storage-browser.
 */

export interface CookieOptions {
  days?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

export interface LocalIndexedDBOptions {
  dbName?: string;
  storeName?: string;
  version?: number;
}

export type ExtensionStorageArea = 'local' | 'sync' | 'session' | 'managed';

export interface ExtensionStorageChange<T = any> {
  oldValue?: T;
  newValue?: T;
}

/**
 * Utility for HTML5 localStorage.
 */
export declare const LocalStorage: {
  get(keyName: string): string | null;
  set(keyName: string, data: any): boolean;
  getJSON<T = any>(keyName: string, fallback?: T | null): T | null;
  setJSON(keyName: string, data: any): boolean;
  remove(keyName: string): boolean;
  clearAll(): boolean;
  has(keyName: string): boolean;
  length(): number;
  key(index: number): string | null;
  keys(): string[];
};

/**
 * Utility for HTML5 sessionStorage.
 */
export declare const LocalSessionStorage: {
  get(keyName: string): string | null;
  set(keyName: string, data: any): boolean;
  getJSON<T = any>(keyName: string, fallback?: T | null): T | null;
  setJSON(keyName: string, data: any): boolean;
  remove(keyName: string): boolean;
  clearAll(): boolean;
  has(keyName: string): boolean;
  length(): number;
  key(index: number): string | null;
  keys(): string[];
};

/**
 * Utility for browser cookies.
 */
export declare const LocalCookiesStorage: {
  get(keyName: string): string | null;
  set(keyName: string, value: string | number | boolean, optionsOrDays?: number | CookieOptions): boolean;
  remove(keyName: string, options?: { path?: string; domain?: string }): boolean;
  clearAll(options?: { path?: string; domain?: string }): boolean;
  has(keyName: string): boolean;
  keys(): string[];
};

/**
 * Promise-based wrapper for HTML5 IndexedDB.
 */
export declare class LocalIndexedDB {
  dbName: string;
  storeName: string;
  version: number;

  constructor(options?: LocalIndexedDBOptions);

  get<T = any>(key: string | number): Promise<T | null>;
  set(key: string | number, value: any): Promise<boolean>;
  remove(key: string | number): Promise<boolean>;
  clear(): Promise<boolean>;
  clearAll(): Promise<boolean>;
  has(key: string | number): Promise<boolean>;
  keys(): Promise<Array<string | number>>;
  getAll<T = any>(): Promise<T[]>;
  entries<T = any>(): Promise<Array<[string | number, T]>>;
  count(): Promise<number>;
  length(): Promise<number>;
  close(): void;
  deleteDatabase(): Promise<boolean>;
}

/**
 * Unified, Promise-based wrapper for WebExtension storage (chrome.storage / browser.storage).
 */
export declare class LocalExtensionStorage {
  area: ExtensionStorageArea;

  constructor(area?: ExtensionStorageArea);

  isAvailable(): boolean;
  get<T = any>(keys?: string | string[] | null): Promise<T | Record<string, any> | null>;
  set(keyOrObject: string | Record<string, any>, value?: any): Promise<boolean>;
  remove(keys: string | string[]): Promise<boolean>;
  clear(): Promise<boolean>;
  clearAll(): Promise<boolean>;
  has(key: string): Promise<boolean>;
  keys(): Promise<string[]>;
  getBytesInUse(keys?: string | string[] | null): Promise<number>;
  watch(
    callback: (changes: Record<string, ExtensionStorageChange>, areaName: ExtensionStorageArea) => void
  ): () => void;
}
