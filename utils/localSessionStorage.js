/**
 * risyandi - 2025 || risyandi.com
 * A package library useful for accessing API of local storage in browser.
 */

export const LocalSessionStorage = {
  get(keyName) {
    return sessionStorage.getItem(keyName);
  },

  set(keyName, data) {
    return sessionStorage.setItem(keyName, data);
  },

  remove(keyName) {
    return sessionStorage.removeItem(keyName);
  },

  clearAll() {
    return sessionStorage.clear();
  },

  length() {
    return sessionStorage.length;
  },

  key(index) {
    return sessionStorage.key(index);
  },
};
