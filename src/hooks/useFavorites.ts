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
      favoriteId: (Math.random() + "").substring(2),
      name: "New favorite",
      database: "",
      host: "",
      password: "",
      user: "",
      timezone: "UTC",
    };

    storage.set(newFavorite.favoriteId, newFavorite);

    setItems([...items, newFavorite]);
  }

  function remove() {
    if (selected) {
      storage.delete(selected.favoriteId).then(() => {
        setItems(items.filter((f) => f.favoriteId !== selected.favoriteId));
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
          return f.favoriteId === id ? updated : f;
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
