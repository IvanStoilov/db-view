import React, { createContext, useContext } from "react";
import { useConnections } from "./useConnections";
import { useFavorites } from "./useFavorites";
import { useModal } from "./useModal";

export const AppContext = createContext<{
  favorites: ReturnType<typeof useFavorites>;
  connections: ReturnType<typeof useConnections>;
  modal: ReturnType<typeof useModal>;
}>(null as any);

export function useAppContext() {
  return useContext(AppContext);
}

export function AppContextProvider(props: React.PropsWithChildren<any>) {
  const favorites = useFavorites();
  const connections = useConnections();
  const modal = useModal();

  return (
    <AppContext.Provider value={{ favorites, connections, modal }}>
      {props.children}
    </AppContext.Provider>
  );
}
