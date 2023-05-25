import React, { useEffect, useState } from "react";
import { Favorite } from "../model/Favorite";

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
        <button className="button" onClick={onAddFavorite}>
          Add favorite
        </button>
      </div>
    </div>
  );

  function getFav(fav: Favorite) {
    return (
      <li key={fav.id}>
        <a onDoubleClick={() => props.onConnect(fav)}>
          <span style={{ fontWeight: "bold" }}>{fav.name}</span>
          <span onClick={() => props.onSelect(fav)}>
            <i className="fas fa-home"></i> Edit
          </span>
        </a>
      </li>
    );
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
