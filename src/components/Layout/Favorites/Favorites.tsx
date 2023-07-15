import React, { useEffect } from "react";
import { Favorite } from "../../../model/Favorite";
import "./Favorites.css";
import { LinksGroup } from "../NavbarLinksGroup";
import { IconDatabase } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import {
  fetchFavorites,
  selectAllFavorites,
} from "../../../store/favoritesSlice";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import {
  closeConnection,
  openConnection,
  selectAllConnections,
} from "../../../store/connectionsSlice";

function Favorites() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(selectAllFavorites);
  const connections = useAppSelector(selectAllConnections);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchFavorites());
  }, []);

  return (
    <>
      {favorites.map((favorite) => (
        <LinksGroup
          key={favorite.id}
          icon={IconDatabase}
          label={favorite.name}
          links={getConnectionLinks(favorite)}
          onEdit={() => navigate("/favorites/" + favorite.id)}
        />
      ))}
    </>
  );

  function getConnectionLinks(fav: Favorite) {
    return [
      ...connections
        .filter((conn) => conn.favorite.id === fav.id)
        .map((conn) => ({
          id: conn.id,
          label: `${conn.name} [${conn.currentDatabase}]`,
          onClick: () => navigate("/connections/" + conn.id),
          onClose: () => dispatch(closeConnection(conn.id)),
        })),
      {
        id: "add",
        label: "Add workspace",
        onClick: () => {
          dispatch(openConnection({ favorite: fav })).then((conn) => {
            navigate("/connections/" + conn.payload);
          });
        },
      },
    ];
  }
}

export default Favorites;
