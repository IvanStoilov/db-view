const mysql = require("mysql2/promise");
const { ipcMain } = require("electron");

class MysqlConnectionManager {
  constructor() {
    this.connections = {};
    ipcMain.handle("mysqlConnect", this.connect.bind(this));
    ipcMain.handle("mysqlExecute", this.execute.bind(this));
  }

  /**
   * Creates a connection and store it
   * @param {string} connName
   * @param {mysql.ConnectionOptions} options
   * @returns {Promise}
   */
  connect(ipc, connection) {
    console.debug("Connecting to MySQL server", { connection });
    const connPromise = mysql.createConnection(connection);

    return new Promise((resolve, reject) => {
      connPromise
        .then((conn) => {
          console.debug("Connected to " + connection.name);
          this.connections[connection.id] = conn;
          resolve();
        })
        .catch(reject);
    });
  }

  /**
   * Executes a query
   * @param {string} connName
   * @param {string} query
   * @returns {Promise}
   */
  execute(ipc, connection, query) {
    if (!this.connections[connection.id]) {
      return Promise.reject(`${connection.name} not connected. Connect first.`);
    }

    console.debug("Executing ", { connection, query });

    return this.connections[connection.id]
      .query(query)
      .then((result) => ({ data: result[0], columns: result[1] }));
  }
}

module.exports = { MysqlConnectionManager };
