/**
 * risyandi - 2022 || risyandi.com
 * A package library useful for accessing API of local storage in browser.
 */

export const LocalStorage = {
    get(keyName, data) {
        const result = localStorage.getItem(keyName, data);
        return result;
    },

    set(keyName, data) {
        const result = localStorage.setItem(keyName, data);
        return result;
    },

    remove(keyName, data) {
        const result = localStorage.removeItem(keyName, data);
        return result;
    },

    clearAll(keyName, data) {
        const result = localStorage.clear(keyName, data);
        return result;
    },

    length() {
        const result = localStorage.length;
        return result
    },

}