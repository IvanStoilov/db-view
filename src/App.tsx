import React, { useEffect, useState } from "react";
import "./App.css";
import Favorites from "./components/Favorites";
import FavoriteForm from "./components/FavoriteForm/FavoriteForm";
import { Favorite } from "./model/Favorite";
import SqlEditor from "./components/SqlEditor/SqlEditor";
import TableList from "./components/TableList/TableList";

type MysqlClient = {
  connect: (fav: Favorite) => Promise<any>;
  execute: (fav: Favorite, query: string) => Promise<any>;
};

declare global {
  var mysql: MysqlClient;
}

function App() {
  useEffect(() => {}, []);
  const [showFavsMenu, setShowFavsMenu] = useState(false);
  const [selectedFav, setSelectedFav] = useState<Favorite | null>(null);
  const [connectFav, setConnectFav] = useState<Favorite | null>(null);

  return (
    <div>
      <header>
        <nav className="navbar" role="navigation" aria-label="main navigation">
          <div
            className="navbar-brand"
            onClick={() => setShowFavsMenu(!showFavsMenu)}
          >
            <span className="navbar-item">
              <i className="fas fa-bars" style={{ fontSize: "1.5em" }}></i>
              &nbsp;&nbsp;DB Viewr
            </span>
          </div>
        </nav>
      </header>
      <div
        className={
          "wrap" + (showFavsMenu || !connectFav ? " wrap--with-favs-menu" : "")
        }
      >
        <div className="favorites">
          <Favorites onSelect={setSelectedFav} onConnect={onFavConnected} />
        </div>
        <div className="sidebar">
          {connectFav && <TableList favorite={connectFav} />}
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
          {!selectedFav && connectFav && <SqlEditor favorite={connectFav} />}
        </div>
      </div>
    </div>
  );

  function onFavConnected(fav: Favorite) {
    setShowFavsMenu(false);
    setSelectedFav(null);
    setConnectFav(fav);
  }
}

export default App;
