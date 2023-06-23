import "./model/ipc";
import "./App.css";
import React from "react";
import Favorites from "./components/Favorites/Favorites";
import FavoriteForm from "./components/FavoriteForm/FavoriteForm";
import { ConnectionView } from "./components/ConnectionView/ConnectionView";
import { useAppContext } from "./hooks/AppContext";
import { ModalDialog } from "./components/common/ModalDialog";
import { Favorite } from "./model/Favorite";
import { Connection } from "./model/Connection";
import { Notifications } from "@mantine/notifications";

function App() {
  const { favorites, connections, modal } = useAppContext();

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
            onSelectConnection={onSelectConnection}
            onAddFavorite={favorites.add}
            onConnectionClose={connections.close}
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
          {connections.selected && !favorites.selected && (
            <ConnectionView connection={connections.selected} />
          )}
        </div>
      </div>
      <ModalDialog />
      <Notifications position="bottom-right" />
    </div>
  );

  function onSelectConnection(conn: Connection) {
    connections.select(conn);
    favorites.clearSelection();
  }
}

export default App;
