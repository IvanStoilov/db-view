import { ipcMain, safeStorage } from "electron";
import Store from "electron-store";

ipcMain.handle("storageSet", storageSet);
ipcMain.handle("storageDelete", storageDelete);
ipcMain.handle("storageGetAll", storageGetAll);

const store = new Store<Record<string, string>>({
  name: "db-view",
  watch: true,
  encryptionKey: "0?hztDVzmf61k(RD#@nY8[f_,j?_p",
});

function storageSet(ipc: unknown, key: string, value: any) {
  const buffer = safeStorage.encryptString(JSON.stringify(value));
  store.set(key, buffer.toString("latin1"));
}

function storageDelete(ipc: unknown, key: string) {
  store.delete(key);
}

function storageGetAll(ipc: unknown): unknown[] {
  const entries = Object.entries(store.store);
  return entries.reduce((values, [key, buffer]) => {
    return [
      ...values,
      JSON.parse(safeStorage.decryptString(Buffer.from(buffer, "latin1"))),
    ];
  }, [] as unknown[]);
}
