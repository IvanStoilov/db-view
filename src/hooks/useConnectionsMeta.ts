import { useState } from "react";
import { QueryResult } from "../model/QueryResult";

type Meta = {
  tables: string[];
  databases: string[];
  currentDatabase: string;
};

export function useConnectionsMeta() {
  const [meta, setMeta] = useState<Record<string, Meta>>({});

  function loadConnectionTables(connectionId: string, currentDatabase: string) {
    return Promise.all([
      dbClient.execute(connectionId, "SHOW TABLES;"),
      dbClient.execute(connectionId, "SHOW SCHEMAS;"),
    ]).then(([tablesResult, databasesResult]) => {
      setMeta({
        ...meta,
        [connectionId]: {
          tables: getList(tablesResult),
          databases: getList(databasesResult),
          currentDatabase,
        },
      });
    });

    function getList(result: QueryResult) {
      const col = result.columns[0].name;
      return result.data.map((d: any) => d[col]);
    }
  }

  function switchDatabase(connectionId: string, database: string) {
    return dbClient.execute(connectionId, `USE ${database}`).then(() => {
      return loadConnectionTables(connectionId, database);
    });
  }

  function getConnectionMeta(connectionId: string): Meta | null {
    return meta[connectionId] || null;
  }

  return {
    loadConnectionTables,
    switchDatabase,
    getConnectionMeta,
  };
}
