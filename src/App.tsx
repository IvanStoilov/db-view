import "./model/ipc";
import "./App.css";
import React, { useState } from "react";
import Favorites from "./components/Favorites/Favorites";
import FavoriteForm from "./components/FavoriteForm/FavoriteForm";
import { Connection } from "./model/Connection";
import { ConnectionTabs } from "./components/ConnectionTabs/ConnectionTabs";
import { ConnectionView } from "./components/ConnectionView/ConnectionView";
import { useFavorites } from "./hooks/useFavorites";
import { useConnections } from "./hooks/useConnections";

function App() {
  const [showFavsMenu, setShowFavsMenu] = useState(true);
  const [activeConnection, setActiveConnection] = useState<Connection | null>(
    null
  );
  const favs = useFavorites();
  const conns = useConnections();

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
              &nbsp;&nbsp;DB Viewr
            </span>
          </div>
        </nav>
      </header>
      <div className="wrap">
        <div
          className="favorites"
          style={{ width: showFavsMenu ? "200px" : "0" }}
        >
          <Favorites
            favorites={favs.items}
            onSelect={favs.select}
            onConnect={conns.connect}
            onAddFavorite={favs.add}
          />
        </div>
        <div className="content">
          {favs.selected && (
            <div className="box">
              <FavoriteForm
                favorite={favs.selected}
                onClose={favs.clearSelection}
                onDelete={favs.remove}
                onUpdate={favs.update}
              />
            </div>
          )}
          <ConnectionTabs
            connections={conns.items}
            activeConnection={activeConnection}
            onActivate={(conn) => setActiveConnection(conn)}
            onClose={conns.close}
          />
          {conns.items.map((conn) => (
            <ConnectionView
              key={conn.connectionId}
              connection={conn}
              isVisible={conn === activeConnection}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
