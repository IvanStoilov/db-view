import { ipcMain } from "electron";
import { DbClient } from "../../../shared/DbClient";
import { DbConnection } from "./DbConnection";
import { MysqlDbConnection } from "./MysqlDbConnection";
import { ConnectionOptions } from "../../../shared/ConnectionOptions";
import { storageGet, storageGetAll } from "./storage";

export class ConnectionManager implements DbClient {
  private connections: Record<string, DbConnection> = {};

  constructor() {
    Object.getOwnPropertyNames(ConnectionManager.prototype)
      .filter((method) => method !== "constructor")
      .forEach((method) => {
        ipcMain.handle("db." + method, (ipc: unknown, ...args: any[]) =>
          (this as any)[method](...args)
        );
      });
  }

  async connect(options: ConnectionOptions) {
    const storedFavorite: any = storageGet(options.favoriteId);

    if (!storedFavorite) {
      throw new Error("Favorite not found");
    }

    const optionsWithPassword = {
      ...options,
      password: storedFavorite.options.password,
    };

    console.debug("Connecting", { options: optionsWithPassword });
    const conn = new MysqlDbConnection(optionsWithPassword);
    await conn.connect();

    console.debug("Connected", { options });
    this.connections[options.id] = conn;
  }

  async close(connectionId: string) {
    const conn = this.getConnection(connectionId);
    console.debug(`Closing ${connectionId}`);
    await conn.close();
    delete this.connections[connectionId];
  }

  async execute(connectionId: string, query: string) {
    console.debug("Executing query", { connectionId, query });
    const conn = this.getConnection(connectionId);
    return conn.execute(query);
  }

  async cancelExecution(connectionId: string) {
    console.debug("Cancelling execution", { connectionId });
    const conn = this.getConnection(connectionId);
    return conn.cancelExecution();
  }

  async closeAllConnection() {
    for (const connectionId of Object.keys(this.connections)) {
      await this.close(connectionId);
    }
  }

  private getConnection(connectionId: string) {
    if (!this.connections[connectionId]) {
      throw new Error(`${connectionId} not connected. Connect first.`);
    }

    return this.connections[connectionId];
  }
}
