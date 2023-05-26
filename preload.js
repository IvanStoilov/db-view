/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("mysql", {
  connect: (connection) => ipcRenderer.invoke("mysqlConnect", connection),
  close: (connection) => ipcRenderer.invoke("mysqlClose", connection),
  execute: (connection, query) =>
    ipcRenderer.invoke("mysqlExecute", connection, query),
});

contextBridge.exposeInMainWorld("storage", {
  set: (key, value) => ipcRenderer.invoke("storageSet", key, value),
  delete: (key) => ipcRenderer.invoke("storageDelete", key),
  getAll: () => ipcRenderer.invoke("storageGetAll"),
});

window.addEventListener("DOMContentLoaded", () => {
  // const replaceText = (selector, text) => {
  //   const element = document.getElementById(selector)
  //   if (element) element.innerText = text
  // }
  // for (const type of ['chrome', 'node', 'electron']) {
  //   replaceText(`${type}-version`, process.versions[type])
  // }
});
