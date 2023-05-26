import { useState } from "react";
import { Connection } from "../model/Connection";
import { Favorite } from "../model/Favorite";
import { QueryResult } from "../model/QueryResult";

export function useConnections() {
  const [items, setItems] = useState<Connection[]>([]);
  const [selected, select] = useState<Connection | null>(null);
  const [results, setResults] = useState<Record<string, QueryResult>>({});

  function connect(favorite: Favorite) {
    const connection = {
      ...favorite,
      connectionId: (Math.random() + "").substring(2),
    };
    mysql.connect(connection).then(() => {
      setItems([...items, connection]);
    });
  }

  function close(connection: Connection) {
    mysql.close(connection).then(() => {
      setItems(items.filter((f) => f.connectionId === connection.connectionId));
      if (selected?.connectionId === connection.connectionId) {
        clearSelection();
      }
    });
  }

  function clearSelection() {
    select(null);
  }

  function execute(connection: Connection, query: string) {
    mysql.execute(connection, query).then((result) => {
      setResults({
        ...results,
        [connection.connectionId]: result,
      });
    });
  }

  return {
    items,
    selected,
    connect,
    close,
    select,
    clearSelection,
    execute,
    result: selected ? results[selected.connectionId] : null,
  };
}
