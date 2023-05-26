import React from "react";
import { Favorite } from "../../model/Favorite";
import "./Favorites.css";

function Favorites(props: {
  favorites: Favorite[];
  onAddFavorite: () => void;
  onSelect: (favorite: Favorite) => void;
  onConnect: (favorite: Favorite) => void;
}) {
  return (
    <div>
      <aside className="menu">
        <ul className="menu-list">{props.favorites.map(getFav)}</ul>
      </aside>
      <div>
        <button
          className="button is-primary is-inverted"
          onClick={props.onAddFavorite}
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
}

export default Favorites;
