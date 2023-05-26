import React, { useEffect, useState } from "react";
import { Connection, Favorite } from "../model/Favorite";
import "./Favorites.css";

function Favorites(props: {
  onSelect: (fav: Favorite) => void;
  onConnect: (connection: Connection) => void;
}) {
  const [favs, setFavs] = useState<Favorite[]>([]);
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavs(favs);
  }, []);

  return (
    <div>
      <aside className="menu">
        <ul className="menu-list">{favs?.map(getFav)}</ul>
      </aside>
      <div>
        <button
          className="button is-primary is-inverted"
          onClick={onAddFavorite}
        >
          <i className="far fa-plus"></i> Add favorite
        </button>
      </div>
    </div>
  );

  function getFav(fav: Favorite) {
    return (
      <li key={fav.favoriteId}>
        <a onDoubleClick={() => connect(fav)} className="favorite-item">
          <span style={{ fontWeight: "bold" }}>{fav.name}</span>
          <span
            className="favorite-item__edit"
            onClick={() => props.onSelect(fav)}
          >
            <i className="fas fa-pen"></i>
          </span>
        </a>
      </li>
    );
  }

  function connect(fav: Favorite) {
    const connection = {
      ...fav,
      connectionId: (Math.random() + "").substring(2),
    };
    window.mysql.connect(connection).then(() => props.onConnect(connection));
  }

  function onAddFavorite() {
    const fav: Favorite = {
      favoriteId: (Math.random() + "").substring(2),
      name: "New favorite",
      database: "",
      host: "",
      password: "",
      user: "",
    };

    const newFavs = [...favs, fav];

    setFavs(newFavs);

    localStorage.setItem("favorites", JSON.stringify(newFavs));
  }
}

export default Favorites;
