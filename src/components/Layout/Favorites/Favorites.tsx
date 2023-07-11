import React, { memo, useCallback, useMemo } from "react";
import { Favorite } from "../../../model/Favorite";
import "./Favorites.css";
import { LinksGroup } from "../NavbarLinksGroup";
import { IconDatabase } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext";
import { useConnectionsMetaContext } from "../../../context/ConnectionsMetaContext";

const Inner = memo(function InnerNonMemo(props: {
  favorites: Array<{ id: string; name: string }>;
  connections: Array<{
    id: string;
    name: string;
    currentDatabase: string;
    favorite: Favorite;
  }>;
  onAddConnection: (favoriteId: string) => void;
  onEditFavorite: (favoriteId: string) => void;
  onSelectConnection: (connectionId: string) => void;
  onCloseConnection: (connectionId: string) => void;
}) {
  return (
    <>
      {props.favorites.map((favorite) => (
        <LinksGroup
          key={favorite.id}
          icon={IconDatabase}
          label={favorite.name}
          links={getConnectionLinks(favorite.id)}
          onEdit={() => props.onEditFavorite(favorite.id)}
        />
      ))}
    </>
  );

  function getConnectionLinks(favId: string) {
    return [
      ...props.connections
        .filter((conn) => conn.favorite.id === favId)
        .map((conn) => ({
          id: conn.id,
          label: `${conn.name} [${conn.currentDatabase}]`,
          onClick: () => props.onSelectConnection(conn.id), //navigate("/connections/" + conn.id),
          onClose: () => props.onCloseConnection(conn.id),
        })),
      {
        id: "add",
        label: "Add workspace",
        onClick: () => props.onAddConnection(favId),
      },
    ];
  }
});

export const Favorites = function FavoritesNoneMemo() {
  const { favorites, connections } = useAppContext();
  const { loadConnectionTables, meta } = useConnectionsMetaContext();
  const navigate = useNavigate();
  const connectionsCacheKey = connections.items
    .map((c) => c.id + c.currentDatabase)
    .join(",");

  const onAddConnection = useCallback(
    (favoriteId: string) => {
      const fav = favorites.items.find((f) => f.id === favoriteId);
      if (fav) {
        connections.connect(fav).then((conn) => {
          loadConnectionTables(conn.id, fav.options.database);
          navigate("/connections/" + conn.id);
        });
      }
    },
    [favorites.items, connectionsCacheKey, meta]
  );

  const onEditFavorite = useCallback((favoriteId: string) => {
    navigate("/favorites/" + favoriteId);
  }, []);

  const onCloseConnection = useCallback(
    (connectionId: string) => {
      const connection = connections.items.find((c) => c.id === connectionId);
      if (connection) {
        connections.close(connection);
      }
    },
    [connectionsCacheKey, meta]
  );

  const onSelectConnection = useCallback((connectionId: string) => {
    navigate("/connections/" + connectionId);
  }, [favorites.items, connectionsCacheKey, meta]);

  const favs = useMemo(() => {
    return favorites.items.map((f) => ({ id: f.id, name: f.name }));
  }, [favorites.items]);

  const conns = useMemo(() => {
    return connections.items.map((f) => ({
      id: f.id,
      name: f.name,
      currentDatabase: f.currentDatabase,
      favorite: f.favorite,
    }));
  }, [connectionsCacheKey, meta]);

  return (
    <Inner
      favorites={favs}
      connections={conns}
      onAddConnection={onAddConnection}
      onEditFavorite={onEditFavorite}
      onCloseConnection={onCloseConnection}
      onSelectConnection={onSelectConnection}
    />
  );
};
