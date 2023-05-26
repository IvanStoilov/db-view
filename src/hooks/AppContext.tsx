import React, { createContext, useContext } from "react";
import { useConnections } from "./useConnections";
import { useFavorites } from "./useFavorites";

export const AppContext = createContext<{
  favorites: ReturnType<typeof useFavorites>
  connections: ReturnType<typeof useConnections>
}>(null as any);

export function useAppContext() {
  return useContext(AppContext);
}

export function AppContextProvider(props: React.PropsWithChildren<any>) {
  const favorites = useFavorites();
  const connections = useConnections();

  return (
    <AppContext.Provider value={{ favorites, connections }}>
      {props.children}
    </AppContext.Provider>
  );
}
