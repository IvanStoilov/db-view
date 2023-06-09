import { ipcMain } from "electron";
import { DbClient } from "../../../shared/db-client";
import { DbConnection } from "./db-connection";
import { MysqlDbConnection } from "./mysql-db-connection";
import { ConnectionOptions } from "../../../shared/connection-options";

export class ConnectionManager implements DbClient {
  private connections: Record<string, DbConnection> = {};

  constructor() {
    Object.getOwnPropertyNames(ConnectionManager.prototype)
      .filter((method) => method !== "constructor")
      .forEach((method) => {
        console.log("db." + method);
        ipcMain.handle("db." + method, (ipc: unknown, ...args: any[]) =>
          (this as any)[method](...args)
        );
      });

    // ipcMain.handle("db.connect", (ipc: unknown, options: ConnectionOptions) =>
    //   this.connect.call(this, options)
    // );
    // ipcMain.handle("db.close", (ipc: unknown, connectionId: string) =>
    //   this.close(connectionId)
    // );
    // ipcMain.handle(
    //   "db.execute",
    //   (ipc: unknown, connectionId: string, query: string) =>
    //     this.execute(connectionId, query)
    // );
    // ipcMain.handle("db.cancelExecution", (ipc: unknown, connectionId: string) =>
    //   this.cancelExecution(connectionId)
    // );
  }

  async connect(options: ConnectionOptions) {
    console.debug("Connecting", { options });
    const conn = new MysqlDbConnection(options);
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
