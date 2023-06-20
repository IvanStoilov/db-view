import React from "react";
import { Favorite } from "../../model/Favorite";
import "./Favorites.css";
import { Connection } from "../../model/Connection";

function Favorites(props: {
  favorites: Favorite[];
  connections: Connection[];
  selectedConnection: Connection | null;
  onAddFavorite: () => void;
  onSelect: (favorite: Favorite) => void;
  onConnect: (favorite: Favorite) => void;
  onSelectConnection: (connection: Connection) => void;
  onConnectionClose: (connection: Connection) => void;
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
      <li key={fav.id}>
        <a onDoubleClick={() => props.onConnect(fav)} className="favorite-item">
          <span style={{ fontWeight: "bold" }}>{fav.name}</span>
          <span
            className="favorite-item__edit"
            onClick={() => props.onSelect(fav)}
          >
            <i className="fas fa-pen"></i>edit
          </span>
        </a>
        <ul>
          {props.connections
            .filter((conn) => conn.favorite.id === fav.id)
            .map(getConnection)}
        </ul>
      </li>
    );
  }

  function getConnection(conn: Connection) {
    return (
      <li key={conn.id}>
        <a
          className={
            "favorite__connection__item" +
            (conn === props.selectedConnection ? " is-active" : "")
          }
          onClick={() => props.onSelectConnection(conn)}
        >
          {conn.name} ({conn.currentDatabase})
          <span
            className="favorite__connection__close"
            onClick={(event) => {
              event.stopPropagation();
              props.onConnectionClose(conn);
            }}
          >
            X
          </span>
        </a>
      </li>
    );
  }
}

export default Favorites;
