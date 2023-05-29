const mysql = require("mysql2/promise");
const { ipcMain } = require("electron");

class MysqlConnectionManager {
  constructor() {
    this.connections = {};
    ipcMain.handle("mysqlConnect", this.connect.bind(this));
    ipcMain.handle("mysqlClose", this.close.bind(this));
    ipcMain.handle("mysqlExecute", this.execute.bind(this));
    ipcMain.handle(
      "mysqlCancelExecution",
      this.mysqlCancelExecution.bind(this)
    );
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
          this.connections[connection.connectionId] = {
            mysqlConnection: conn,
            favorite: connection.favorite,
          };
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
  async close(ipc, connectionId) {
    const conn = await this.getConnection(connectionId);
    console.debug(`Closing ${conn.favorite.name}`);
    await conn.mysqlConnection.end();
    delete this.connections[connectionId];
  }

  /**
   * Executes a query
   * @param {string} connName
   * @param {string} query
   * @returns {Promise}
   */
  async execute(ipc, connectionId, query) {
    console.debug("Executing ", { connectionId, query });

    const mysqlConnection = await this.getMysqlConnection(connectionId);

    return mysqlConnection
      .query(query)
      .then((result) => ({ data: result[0], columns: result[1] }));
  }

  /**
   * Cancels execution of the running query for the current connection
   * @param {string} connName
   * @returns {Promise}
   */
  async mysqlCancelExecution(ipc, connectionId) {
    const favorite = await this.getFavorite(connectionId);
    const mysqlConnection = await this.getMysqlConnection(connectionId);
    const conn = await mysql.createConnection(favorite);
    const sql = `KILL QUERY ${mysqlConnection.threadId}`;
    console.debug(`Cancelling query: ${sql}`);
    await conn.execute(sql).then((result) => console.log(result));
    await conn.end();
  }

  /**
   * Closes all open connections
   */
  async closeAllConnection() {
    for (const connectionId of Object.keys(this.connections)) {
      await this.close(null, connectionId)
    }
  }

  async getMysqlConnection(connectionId) {
    return (await this.getConnection(connectionId)).mysqlConnection;
  }

  async getFavorite(connectionId) {
    return (await this.getConnection(connectionId)).favorite;
  }

  async getConnection(connectionId) {
    if (!this.connections[connectionId]) {
      throw new Error(`${connectionId} not connected. Connect first.`);
    }

    return this.connections[connectionId];
  }
}

module.exports = { MysqlConnectionManager };
