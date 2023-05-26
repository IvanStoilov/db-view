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
      tables: [],
    };

    mysql.connect(connection).then(() => {
      setItems(
        produce(items, (draft) => {
          draft[connection.connectionId] = connection;
        })
      );
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

  function execute(connectionId: string, query: string) {
    console.debug(`Executing (${connectionId}): ${query}`);

    mysql.execute(connectionId, query).then((queryResult) => {
      console.debug(`Results (${connectionId})`, queryResult);

      setItems(
        produce(items, (draft) => {
          draft[connectionId].queryResult = queryResult;
        })
      );
    });
  }

  function select(connection: Connection | null) {
    setSelectedId(connection === null ? null : connection.connectionId);
  }

  function setQuery(query: string) {
    if (selectedId) {
      setItems(
        produce(items, (draft) => {
          draft[selectedId].query = query;
        })
      );
    }
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
  };
}
