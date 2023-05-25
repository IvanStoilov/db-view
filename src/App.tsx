import React, { useEffect, useState } from "react";
import "./App.css";
import Favorites from "./components/Favorites";
import FavoriteForm from "./components/FavoriteForm/FavoriteForm";
import { Favorite } from "./model/Favorite";
import SqlEditor from "./components/SqlEditor/SqlEditor";

function App() {
  useEffect(() => {}, []);
  const [selectedFav, setSelectedFav] = useState<Favorite | null>(null);
  const [connectFav, setConnectFav] = useState<Favorite | null>(null);

  return (
    <div>
      <header>Hi</header>
      <div>
        <div>
          <Favorites onSelect={setSelectedFav} onConnect={setConnectFav} />
        </div>
        <div>
          {!connectFav && selectedFav && (
            <div className="modal is-active">
              <div className="modal-background"></div>
              <div className="modal-content">
                <div className="box">
                  <FavoriteForm
                    favorite={selectedFav}
                    onClose={() => setSelectedFav(null)}
                  />
                </div>
              </div>
            </div>
          )}
          {connectFav && <SqlEditor favorite={connectFav} />}
        </div>
      </div>
    </div>
  );
}

export default App;
