# Local Storage Browser
A package library useful for accessing API of local storage, session storage, and cookies in the browser.

The `localStorage` read-only property of the window interface allows you to access a Storage object for the Document's origin; the stored data is saved across browser sessions.

`localStorage` is similar to `sessionStorage`, except that while `localStorage` data has no expiration time, `sessionStorage` data gets cleared when the page session ends — that is, when the page is closed. (`localStorage` data for a document loaded in a "*private browsing*" or "*incognito*" session is cleared when the last "*private*" tab is closed.)  [learn more.](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) 

## How to install package from npm
Before using the library, install npm or node, then type this command:
```
$ npm i local-storage-browser
```


## How to use this library
You can import the storage utilities as follows:
```js
import { LocalStorage, LocalSessionStorage, LocalCookiesStorage } from 'local-storage-browser';
```

---

### LocalStorage API

**A. Get Item**  
Returns the value for the given key.
```js
let result = LocalStorage.get(key);
console.log(result);
```
**B. Set Item**  
Adds or updates a key-value pair.
```js
LocalStorage.set(key, value);
```
**C. Remove Item**   
Removes the given key.
```js
LocalStorage.remove(key);
```
**D. Clear All Items**  
Removes all keys.
```js
LocalStorage.clearAll();
```
**E. Count Items**  
Returns the number of items.
```js
let count = LocalStorage.length();
console.log(count);
```
**F. Key by Index**  
Returns the key name at the given index.
```js
for (let index = 0; index < LocalStorage.length(); index++) {
    let keyName = LocalStorage.key(index);
    let value = LocalStorage.get(keyName);
    console.log(keyName, value);
}
```

---

### LocalSessionStorage API

Usage is identical to LocalStorage, but operates on sessionStorage:
```js
LocalSessionStorage.set(key, value);
let value = LocalSessionStorage.get(key);
LocalSessionStorage.remove(key);
LocalSessionStorage.clearAll();
let count = LocalSessionStorage.length();
let keyName = LocalSessionStorage.key(index);
```

---

### LocalCookiesStorage API

**A. Get Cookie**  
Returns the value for the given cookie name.
```js
let value = LocalCookiesStorage.get(cookieName);
console.log(value);
```
**B. Set Cookie**  
Sets a cookie with optional expiration (in days).
```js
LocalCookiesStorage.set(cookieName, value, days); // days is optional, default is 7
```
**C. Remove Cookie**  
Removes the given cookie.
```js
LocalCookiesStorage.remove(cookieName);
```
**D. Clear All Cookies**  
Removes all cookies.
```js
LocalCookiesStorage.clearAll();
```
**E. List Cookie Keys**  
Returns an array of all cookie names.
```js
let keys = LocalCookiesStorage.keys();
console.log(keys);
```