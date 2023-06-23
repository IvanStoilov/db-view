import { contextBridge, ipcRenderer } from "electron";

const dbClient = ["connect", "close", "execute", "cancelExecution"]
  .filter((method) => method !== "constructor")
  .reduce(
    (obj, method) => ({
      ...obj,
      [method]: (...args: any[]) => ipcRenderer.invoke("db." + method, ...args),
    }),
    {}
  );

const storageClient = {
  set: (key: string, value: unknown) =>
    ipcRenderer.invoke("storageSet", key, value),
  delete: (key: string) => ipcRenderer.invoke("storageDelete", key),
  getAll: () => ipcRenderer.invoke("storageGetAll"),
};

contextBridge.exposeInMainWorld("dbClient", dbClient);
contextBridge.exposeInMainWorld("storage", storageClient);

window.addEventListener("DOMContentLoaded", () => {});

export {};
