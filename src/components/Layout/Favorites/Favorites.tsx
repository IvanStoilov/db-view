import React from "react";
import { Favorite } from "../../../model/Favorite";
import "./Favorites.css";
import { LinksGroup } from "../NavbarLinksGroup";
import { IconDatabase } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext";

function Favorites() {
  const { favorites, connections } = useAppContext();
  const navigate = useNavigate();

  return (
    <>
      {favorites.items.map((favorite) => (
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
      ...connections.items
        .filter((conn) => conn.favorite.id === fav.id)
        .map((conn) => ({
          id: conn.id,
          label: `${conn.name} [${conn.currentDatabase}]`,
          onClick: () => navigate("/connections/" + conn.id),
          onClose: () => connections.close(conn),
        })),
      {
        id: "add",
        label: "Add workspace",
        onClick: () => {
          connections.connect(fav).then((conn) => {
            navigate("/connections/" + conn.id);
          });
        },
      },
    ];
  }
}

export default Favorites;
