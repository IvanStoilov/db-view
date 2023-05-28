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
    const suffix =
      connectionsWithSameNameCount > 0
        ? ` (${connectionsWithSameNameCount})`
        : "";

    const connection = {
      favorite,
      name: favorite.name + suffix,
      connectionId: (Math.random() + "").substring(2),
      query: "select * from address",
      queryResult: null,
      error: null,
      tables: [],
      isLoading: false,
    };

    mysql.connect(connection).then(() => {
      setItems(
        produce(items, (draft) => {
          draft[connection.connectionId] = connection;
        })
      );

      mysql.execute(connection.connectionId, "SHOW TABLES;").then((result) => {
        const col = result.columns[0].name;
        setItems((i) =>
          produce(i, (draft) => {
            draft[connection.connectionId].tables = result.data.map(
              (d: any) => d[col]
            );
          })
        );
      });

      select(connection);
    });
  }

  function close(connection: Connection) {
    mysql.close(connection.connectionId).then(() => {
      setItems(
        produce(items, (draft) => {
          delete draft[connection.connectionId];
        })
      );
      if (selectedId === connection.connectionId) {
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

    mysql
      .execute(connectionId, query)
      .then((queryResult) => {
        setItems((i) =>
          produce(i, (draft) => {
            draft[connectionId].queryResult = {
              ...queryResult,
              query: updateLastQuery
                ? query
                : draft[connectionId].queryResult?.query || query,
            };
            draft[connectionId].isLoading = false;
          })
        );
      })
      .catch((error) => {
        setItems((i) =>
          produce(i, (draft) => {
            draft[connectionId].error = error.message;
            draft[connectionId].isLoading = false;
          })
        );
      });
  }

  function select(connection: Connection | null) {
    setSelectedId(() => (connection === null ? null : connection.connectionId));
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
  };
}
