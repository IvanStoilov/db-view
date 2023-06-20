import "./model/ipc";
import "./App.css";
import React from "react";
import Favorites from "./components/Favorites/Favorites";
import FavoriteForm from "./components/FavoriteForm/FavoriteForm";
import { ConnectionView } from "./components/ConnectionView/ConnectionView";
import { useAppContext } from "./hooks/AppContext";
import { ModalDialog } from "./components/common/ModalDialog";

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
            onConnect={async fav => {
              try {
                await connections.connect(fav);
              } catch (error: any) {
                modal.showModal({ content: error.message, hideOk: true })
              }

            }}
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
      <ModalDialog />
    </div>
  );
}

export default App;
