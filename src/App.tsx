import "./model/ipc";
import "./App.css";
import React from "react";
import Favorites from "./components/Favorites/Favorites";
import FavoriteForm from "./components/FavoriteForm/FavoriteForm";
import { ConnectionView } from "./components/ConnectionView/ConnectionView";
import { useAppContext } from "./hooks/AppContext";

function App() {
  const { favorites, connections } = useAppContext();

  return (
    <div>
      <div className="wrap">
        <div className="favorites">
          <Favorites
            favorites={favorites.items}
            connections={connections.items}
            selectedConnection={connections.selected}
            onSelect={favorites.select}
            onConnect={connections.connect}
            onSelectConnection={connections.select}
            onAddFavorite={favorites.add}
          />
        </div>
        <div className="content-right">
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
