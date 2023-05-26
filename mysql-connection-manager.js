const mysql = require("mysql2/promise");
const { ipcMain } = require("electron");

class MysqlConnectionManager {
  constructor() {
    this.connections = {};
    ipcMain.handle("mysqlConnect", this.connect.bind(this));
    ipcMain.handle("mysqlClose", this.close.bind(this));
    ipcMain.handle("mysqlExecute", this.execute.bind(this));
  }

  /**
   * Creates a connection and store it
   * @param {mysql.ConnectionOptions} connection
   * @returns {Promise}
   */
  connect(ipc, connection) {
    console.debug("Connecting to MySQL server", { connection });
    const connPromise = mysql.createConnection(connection.favorite);

    return new Promise((resolve, reject) => {
      connPromise
        .then((conn) => {
          console.debug("Connected to " + connection.favorite.name);
          this.connections[connection.connectionId] = conn;
          resolve();
        })
        .catch(reject);
    });
  }

  /**
   * Closes a connection
   * @param {Connection} connection
   * @returns {Promise}
   */
  close(ipc, connectionId) {
    const mysqlConnection = this.connections[connectionId];

    if (!mysqlConnection) {
      return Promise.reject("Connection not found");
    }

    return mysqlConnection.end();
  }

  /**
   * Executes a query
   * @param {string} connName
   * @param {string} query
   * @returns {Promise}
   */
  execute(ipc, connectionId, query) {
    if (!this.connections[connectionId]) {
      return Promise.reject(`${connectionId} not connected. Connect first.`);
    }

    console.debug("Executing ", { connectionId, query });

    return this.connections[connectionId]
      .query(query)
      .then((result) => ({ data: result[0], columns: result[1] }));
  }

  /**
   * Closes all open connections
   */
  closeAllConnection() {
    Object.values(this.connections).forEach((conn) => conn.close());
  }
}

module.exports = { MysqlConnectionManager };
