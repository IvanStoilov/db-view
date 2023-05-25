import React, { useEffect, useState } from "react";
import { Favorite } from "../model/Favorite";
import "./Favorites.css";

function Favorites(props: {
  onSelect: (fav: Favorite) => void;
  onConnect: (fav: Favorite) => void;
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
      <li key={fav.id}>
        <a
          onDoubleClick={() => connect(fav)}
          onClick={() => props.onSelect(fav)}
          className="favorite-item"
        >
          <span style={{ fontWeight: "bold" }}>{fav.name}</span>
          <span className="favorite-item__edit">
            <i className="fas fa-pen"></i>
          </span>
        </a>
      </li>
    );
  }

  function connect(fav: Favorite) {
    (window as any).mysql.connect(fav).then(() => props.onConnect(fav));
  }

  function onAddFavorite() {
    const fav: Favorite = {
      id: (Math.random() + "").substring(2),
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
