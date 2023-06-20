import { useState } from "react";
import { Connection } from "../model/Connection";
import { Favorite } from "../model/Favorite";
import { produce } from "immer";

export function useConnections() {
  const [items, setItems] = useState<Record<string, Connection>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? items[selectedId] || null : null;
  const itemsArray = Object.values(items);

  function connect(favorite: Favorite) {
    const connectionsWithSameNameCount = itemsArray.filter(
      (conn) => conn.favorite.name === favorite.name
    ).length;
    const connection: Connection = {
      favorite,
      name: `#${connectionsWithSameNameCount + 1}`,
      id: (Math.random() + "").substring(2),
      query: `select sleep(${Math.ceil(Math.random() * 2000)})`,
      queryResult: null,
      error: null,
      tables: [],
      databases: [],
      currentDatabase: favorite.options.database,
      isLoading: false,
    };

    const options = {
      type: "mysql" as const,
      id: connection.id,
      ...favorite.options,
    };

    dbClient.connect(options).then(() => {
      setItems(
        produce(items, (draft) => {
          draft[connection.id] = connection;
        })
      );

      reloadMeta(connection.id);

      select(connection);
    });
  }

  function close(connection: Connection) {
    dbClient.close(connection.id).then(() => {
      setItems(
        produce(items, (draft) => {
          delete draft[connection.id];
        })
      );
      if (selectedId === connection.id) {
        clearSelection();
      }
    });
  }

  function clearSelection() {
    select(null);
  }

  function execute(
    connectionId: string,
    query: string,
    updateLastQuery: boolean = true
  ) {
    console.debug(`Executing (${connectionId}): ${query}`);
    setItems((i) =>
      produce(i, (draft) => {
        draft[connectionId].error = null;
        draft[connectionId].isLoading = true;
      })
    );

    return dbClient
      .execute(connectionId, query)
      .then((queryResult) => {
        console.debug("Result", queryResult);
        setItems((i) =>
          produce(i, (draft) => {
            const currentQueryResult = draft[connectionId].queryResult;
            if (queryResult.columns) {
              // Select query
              draft[connectionId].queryResult = {
                columns: queryResult.columns,
                data: queryResult.data,
                query: updateLastQuery
                  ? query
                  : currentQueryResult?.query || query,
                ddlStatus: null,
              };
            } else {
              // DDL query
              draft[connectionId].queryResult = {
                columns: currentQueryResult?.columns || [],
                data: currentQueryResult?.data || [],
                query: draft[connectionId].queryResult?.query || "",
                ddlStatus: queryResult.data as any,
              };
            }

            draft[connectionId].isLoading = false;
          })
        );
      })
      .catch((error: any) => {
        console.error(error);
        setItems((i) =>
          produce(i, (draft) => {
            draft[connectionId].error = error.message;
            draft[connectionId].isLoading = false;
          })
        );
      });
  }

  function select(connection: Connection | null) {
    setSelectedId(() => (connection === null ? null : connection.id));
  }

  function setQuery(query: string) {
    if (selectedId) {
      setItems((i) =>
        produce(i, (draft) => {
          draft[selectedId].query = query;
        })
      );
    }
  }

  function clearError(connectionId: string) {
    setItems((i) =>
      produce(i, (draft) => {
        draft[connectionId].error = null;
      })
    );
  }

  function switchDatabase(db: string) {
    if (selectedId) {
      return dbClient.execute(selectedId, `USE ${db}`).then(() => {
        reloadMeta(selectedId);

        setItems((i) =>
          produce(i, (draft) => {
            draft[selectedId].currentDatabase = db;
          })
        );
      });
    }

    return Promise.resolve();
  }

  function reloadMeta(connectionId: string) {
    dbClient.execute(connectionId, "SHOW TABLES;").then((result) => {
      const col = result.columns[0].name;
      setItems((i) =>
        produce(i, (draft) => {
          draft[connectionId].tables = result.data.map((d: any) => d[col]);
        })
      );
    });

    dbClient.execute(connectionId, "SHOW SCHEMAS;").then((result) => {
      const col = result.columns[0].name;
      setItems((i) =>
        produce(i, (draft) => {
          draft[connectionId].databases = result.data.map((d: any) => d[col]);
        })
      );
    });
  }

  return {
    items: itemsArray,
    selected,

    connect,
    close,
    select,
    clearSelection,
    execute,
    setQuery,
    clearError,
    switchDatabase,
  };
}
