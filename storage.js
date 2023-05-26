const { ipcMain, safeStorage } = require("electron");
const Store = require("electron-store");

ipcMain.handle("storageSet", storageSet);
ipcMain.handle("storageDelete", storageDelete);
ipcMain.handle("storageGetAll", storageGetAll);

const store = new Store({
  name: "db-view",
  watch: true,
  encryptionKey: "0?hztDVzmf61k(RD#@nY8[f_,j?_p",
});

function storageSet(ipc, key, value) {
  const buffer = safeStorage.encryptString(JSON.stringify(value));
  store.set(key, buffer.toString("latin1"));
}

function storageDelete(ipc, key) {
  store.delete(key);
}

function storageGetAll(ipc) {
  return Object.entries(store.store).reduce((values, [key, buffer]) => {
    return [
      ...values,
      JSON.parse(safeStorage.decryptString(Buffer.from(buffer, "latin1"))),
    ];
  }, []);
}
