import React, { useEffect, useState } from "react";
import "./App.css";
import Favorites from "./components/Favorites";
import FavoriteForm from "./components/FavoriteForm/FavoriteForm";
import { Connection, Favorite } from "./model/Favorite";
import TableList from "./components/TableList/TableList";
import { ConnectionTabs } from "./components/ConnectionTabs/ConnectionTabs";
import { ConnectionView } from "./components/ConnectionView/ConnectionView";

type MysqlClient = {
  connect: (connection: Connection) => Promise<any>;
  close: (connection: Connection) => Promise<void>;
  execute: (connection: Connection, query: string) => Promise<any>;
};

declare global {
  var mysql: MysqlClient;

  interface Window {
    mysql: MysqlClient;
  }
}

function App() {
  useEffect(() => {}, []);
  const [showFavsMenu, setShowFavsMenu] = useState(true);
  const [selectedFav, setSelectedFav] = useState<Favorite | null>(null);
  const [activeConnection, setActiveConnection] = useState<Connection | null>(
    null
  );
  const [connections, setConnections] = useState<Connection[]>([]);

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
          <Favorites onSelect={setSelectedFav} onConnect={onFavConnected} />
        </div>
        <div className="content">
          {selectedFav && (
            <div className="box">
              <FavoriteForm
                favorite={selectedFav}
                onClose={() => setSelectedFav(null)}
              />
            </div>
          )}
          <ConnectionTabs
            connections={connections}
            activeConnection={activeConnection}
            onActivate={(conn) => setActiveConnection(conn)}
            onClose={closeConnection}
          />
          {connections.map((conn) => (
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

  function onFavConnected(connection: Connection) {
    setSelectedFav(null);
    setShowFavsMenu(false);
    setActiveConnection(connection);
    setConnections([...connections, connection]);
  }

  function closeConnection(connection: Connection) {
    mysql.close(connection).then(() => {
      setConnections(connections.filter((c) => c !== connection));
      setActiveConnection(connections[0] || null);
    });
  }
}

export default App;
