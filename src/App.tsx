import "./model/ipc";
import "./App.css";
import React, { useState } from "react";
import Favorites from "./components/Favorites/Favorites";
import FavoriteForm from "./components/FavoriteForm/FavoriteForm";
import { ConnectionTabs } from "./components/ConnectionTabs/ConnectionTabs";
import { ConnectionView } from "./components/ConnectionView/ConnectionView";
import { useAppContext } from "./hooks/AppContext";

function App() {
  const [showFavsMenu, setShowFavsMenu] = useState(true);
  const { favorites, connections } = useAppContext();

  return (
    <div>
      <header>
        <nav className="navbar" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <span
              className="navbar-item"
              onClick={() => setShowFavsMenu(!showFavsMenu)}
            >
              <i className="fas fa-bars" style={{ fontSize: "1.5em" }}></i>
            </span>
          </div>

          <ConnectionTabs
            connections={connections.items}
            activeConnection={connections.selected}
            onActivate={connections.select}
            onClose={connections.close}
          />
        </nav>
      </header>
      <div className="wrap">
        <div
          className="favorites"
          style={{ width: showFavsMenu ? "200px" : "0" }}
        >
          <Favorites
            favorites={favorites.items}
            onSelect={favorites.select}
            onConnect={(fav) => {
              connections.connect(fav);
              setShowFavsMenu(false);
            }}
            onAddFavorite={favorites.add}
          />
        </div>
        <div className="content">
          {favorites.selected && (
            <div className="box">
              <FavoriteForm
                favorite={favorites.selected}
                onClose={favorites.clearSelection}
                onDelete={favorites.remove}
                onUpdate={favorites.update}
              />
            </div>
          )}
          {connections.selected && (
            <ConnectionView connection={connections.selected} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
