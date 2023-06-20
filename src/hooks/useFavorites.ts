import { useEffect, useState } from "react";
import { Favorite } from "../model/Favorite";

export function useFavorites() {
  const [items, setItems] = useState<Favorite[]>([]);
  const [selected, select] = useState<Favorite | null>(null);

  useEffect(() => {
    storage.getAll().then(setItems);
  }, []);

  function add() {
    const newFavorite: Favorite = {
      id: (Math.random() + "").substring(2),
      name: "New favorite",
      options: {
        database: "",
        host: "",
        password: "",
        user: "",
        timezone: "UTC",
      },
    };

    storage.set(newFavorite.id, newFavorite);

    setItems([...items, newFavorite]);
  }

  function remove() {
    if (selected) {
      storage.delete(selected.id).then(() => {
        setItems(items.filter((f) => f.id !== selected.id));
        clearSelection();
      });
    }
  }

  function clearSelection() {
    select(null);
  }

  function update(id: string, updated: Favorite) {
    storage.set(id, updated).then(() => {
      setItems(
        items.map((f) => {
          return f.id === id ? updated : f;
        })
      );
    });
  }

  return {
    items,
    selected,
    add,
    remove,
    select,
    clearSelection,
    update,
  };
}
