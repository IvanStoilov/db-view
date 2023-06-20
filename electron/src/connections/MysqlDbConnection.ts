import { DbConnection } from "./DbConnection";
import {
  createConnection,
  Connection,
  ConnectionOptions,
} from "mysql2/promise";

export class MysqlDbConnection implements DbConnection {
  private conn: Connection | undefined;

  constructor(private options: ConnectionOptions) {}

  async connect(): Promise<void> {
    this.conn = await createConnection(this.options);
  }

  close(): Promise<void> {
    return this.getConnection().end();
  }

  async execute(query: string): Promise<any> {
    const result = await this.getConnection().query(query);

    return {
      data: result[0],
      columns: !result[1]
        ? null
        : result[1].map((col) => ({
            name: col.name,
            type: TYPE_ID_TO_NAME(col.type) || "UNKNOWN",
            table: col.orgTable,
            db: col.db,
            flags: col.flags,
            catalog: col.catalog,
          })),
    };
  }

  async cancelExecution(): Promise<void> {
    const tempConn = await createConnection(this.options);
    const sql = `KILL QUERY ${this.getConnection().threadId}`;
    try {
      await tempConn.execute(sql);
    } finally {
      await tempConn.end();
    }
  }

  async fetchTables(): Promise<string> {
    const tables = await this.getConnection().query("SHOW TABLES");
    return (tables[0] as any).map((table: any) => Object.values(table)[0]);
  }

  async fetchSchemas(): Promise<string> {
    const schemas = await this.getConnection().query("SHOW SCHEMAS");
    return (schemas[0] as any).map((schema: any) => Object.values(schema)[0]);
  }

  private getConnection(): Connection {
    if (!this.conn) {
      throw new Error("Not connected");
    }
    return this.conn;
  }
}

function TYPE_ID_TO_NAME(typeId: number): string {
  return (
    {
      0: "DECIMAL",
      1: "TINY",
      2: "SHORT",
      3: "LONG",
      4: "FLOAT",
      5: "DOUBLE",
      6: "NULL",
      7: "TIMESTAMP",
      8: "LONGLONG",
      9: "INT24",
      10: "DATE",
      11: "TIME",
      12: "DATETIME",
      13: "YEAR",
      14: "NEWDATE",
      15: "VARCHAR",
      16: "BIT",
      245: "JSON",
      246: "NEWDECIMAL",
      247: "ENUM",
      248: "SET",
      249: "TINY_BLOB",
      250: "MEDIUM_BLOB",
      251: "LONG_BLOB",
      252: "BLOB",
      253: "VARCHAR",
      254: "STRING",
      255: "GEOMETRY",
    }[typeId] || "UNKNOWN"
  );
}
