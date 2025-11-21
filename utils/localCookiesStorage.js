/**
 * risyandi - 2025 || risyandi.com
 * A package library useful for accessing API of local storage in browser.
 */

export const LocalCookiesStorage = {
    get(keyName) {
        const name = keyName + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return null;
    },

    set(keyName, value, days = 7) {
        const d = new Date();
        d.setTime(d.getTime() + (days*24*60*60*1000));
        const expires = "expires=" + d.toUTCString();
        document.cookie = keyName + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
    },

    remove(keyName) {
        document.cookie = keyName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    },

    clearAll() {
        const cookies = document.cookie.split("; ");
        for (const cookie of cookies) {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
        }
    },

    keys() {
        return document.cookie.split("; ").map(cookie => cookie.split("=")[0]);
    }
}