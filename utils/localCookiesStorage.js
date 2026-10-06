/**
 * Created by Risyandi in collaboration with AI.
 * Contact: hello@risyandi.com
 * Licensed under the MIT License
 * LocalCookiesStorage utility for managing browser cookies with expiration and security options.
 */

const isDocumentAvailable = () => typeof document !== 'undefined';

export const LocalCookiesStorage = {
  /**
   * Get a cookie by name.
   * @param {string} keyName
   * @returns {string|null}
   */
  get(keyName) {
    if (!isDocumentAvailable() || !document.cookie) return null;
    try {
      const name = encodeURIComponent(keyName) + '=';
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(name) === 0) {
          return decodeURIComponent(cookie.substring(name.length));
        }
      }
      return null;
    } catch (error) {
      console.warn(`[local-storage-browser] Error reading cookie "${keyName}":`, error);
      return null;
    }
  },

  /**
   * Set a cookie.
   * @param {string} keyName
   * @param {string|number|boolean} value
   * @param {number|{ days?: number, path?: string, domain?: string, secure?: boolean, sameSite?: 'Strict'|'Lax'|'None' }} [optionsOrDays=7]
   * @returns {boolean}
   */
  set(keyName, value, optionsOrDays = 7) {
    if (!isDocumentAvailable()) return false;
    try {
      let days = 7;
      let path = '/';
      let domain = '';
      let secure = false;
      let sameSite = '';

      if (typeof optionsOrDays === 'number') {
        days = optionsOrDays;
      } else if (typeof optionsOrDays === 'object' && optionsOrDays !== null) {
        if (typeof optionsOrDays.days === 'number') days = optionsOrDays.days;
        if (typeof optionsOrDays.path === 'string') path = optionsOrDays.path;
        if (typeof optionsOrDays.domain === 'string') domain = optionsOrDays.domain;
        if (typeof optionsOrDays.secure === 'boolean') secure = optionsOrDays.secure;
        if (typeof optionsOrDays.sameSite === 'string') sameSite = optionsOrDays.sameSite;
      }

      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      let cookieString = `${encodeURIComponent(keyName)}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=${path}`;

      if (domain) cookieString += `; domain=${domain}`;
      if (secure) cookieString += '; Secure';
      if (sameSite) cookieString += `; SameSite=${sameSite}`;

      document.cookie = cookieString;
      return true;
    } catch (error) {
      console.warn(`[local-storage-browser] Error setting cookie "${keyName}":`, error);
      return false;
    }
  },

  /**
   * Remove a cookie by name.
   * @param {string} keyName
   * @param {{ path?: string, domain?: string }} [options={}]
   * @returns {boolean}
   */
  remove(keyName, options = {}) {
    if (!isDocumentAvailable()) return false;
    try {
      const path = options.path || '/';
      let cookieString = `${encodeURIComponent(keyName)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
      if (options.domain) {
        cookieString += `; domain=${options.domain}`;
      }
      document.cookie = cookieString;
      return true;
    } catch (error) {
      console.warn(`[local-storage-browser] Error removing cookie "${keyName}":`, error);
      return false;
    }
  },

  /**
   * Clear all accessible cookies for the current path.
   * @param {{ path?: string, domain?: string }} [options={}]
   * @returns {boolean}
   */
  clearAll(options = {}) {
    if (!isDocumentAvailable() || !document.cookie) return false;
    try {
      const keysList = this.keys();
      for (const key of keysList) {
        this.remove(key, options);
      }
      return true;
    } catch (error) {
      console.warn('[local-storage-browser] Error clearing cookies:', error);
      return false;
    }
  },

  /**
   * Check if a cookie exists by name.
   * @param {string} keyName
   * @returns {boolean}
   */
  has(keyName) {
    return this.get(keyName) !== null;
  },

  /**
   * Return an array of all cookie names.
   * @returns {string[]}
   */
  keys() {
    if (!isDocumentAvailable() || !document.cookie) return [];
    try {
      return document.cookie
        .split(';')
        .map((cookie) => cookie.trim())
        .filter(Boolean)
        .map((cookie) => {
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
          return decodeURIComponent(name);
        });
    } catch {
      return [];
    }
  }
};