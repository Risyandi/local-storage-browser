# Local Storage Browser
A package library useful for accessing API of local storage in browser.

The `localStorage` read-only property of the window interface allows you to access a Storage object for the Document's origin; the stored data is saved across browser sessions.

`localStorage` is similar to `sessionStorage`, except that while `localStorage` data has no expiration time, `sessionStorage` data gets cleared when the page session ends — that is, when the page is closed. (`localStorage` data for a document loaded in a "*private browsing*" or "*incognito*" session is cleared when the last "*private*" tab is closed.)  [learn more.](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) 

## How to install package from npm
before we use the library you can install npm or node and the you just typing this command:
```
$ npm i local-storage-browser
```

## How to use this library
before we use the library you can import, with this example:
```js
import {LocalStorage} from 'local-storage-browser';
```
**A. Get Items**  
When passed a key name, will return that key's value.
```js
let result = LocalStorage.get(key, data);
console.log(result);
```
**B. Set Items**  
When passed a key name and value, will add that key to the storage, or update that key's value if it already exists.
```js
let result = LocalStorage.set(key, data);
console.log(result);
```
**C. Remove Items**   
When passed a key name, will remove that key from the storage.
```js
let result = LocalStorage.remove(key, data);
console.log(result);
```
**D. Clear All Items**  
When invoked, will empty all keys out of the storage.
```js
let result = LocalStorage.clearAll(key, data);
console.log(result);
```
**E. Count Length Items**  
When to know length of items of the storage. 
```js
let result = LocalStorage.length(key, data);
console.log(result);
```
**F. Key by index**  
When passed a number n, returns the name of the nth key in a given Storage object. 
```js
for (let index = 0; index < LocalStorage.length(data); index++) {
    let result = LocalStorage.get(LocalStorage.key(index));
    console.log(result);
}
```