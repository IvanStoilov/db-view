import React, { createContext, useContext } from "react";
import { useConnectionsMeta } from "../hooks/useConnectionsMeta";

export const ConnectionsMetaContext = createContext<
  ReturnType<typeof useConnectionsMeta>
>(null as any);

export function useConnectionsMetaContext() {
  return useContext(ConnectionsMetaContext);
}

export function ConnectionsMetaContextProvider(
  props: React.PropsWithChildren<any>
) {
  const connectionsMeta = useConnectionsMeta();

  return (
    <ConnectionsMetaContext.Provider value={connectionsMeta}>
      {props.children}
    </ConnectionsMetaContext.Provider>
  );
}
