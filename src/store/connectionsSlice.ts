import {
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { Connection, Workspace } from "../model/Connection";
import { RootState } from "./store";
import { Favorite } from "../model/Favorite";

export const connectionsAdapter = createEntityAdapter<Connection>();

// export const fetchConnections = createAsyncThunk("connections/fetch", () =>
//   storage.getAll()
// );

export const closeConnection = createAsyncThunk(
  "connections/close",
  async (id: string) => {
    await dbClient.close(id);
    return id;
  }
);

export const openConnection = createAsyncThunk(
  "connections/open",
  async ({ favorite }: { favorite: Favorite }, api) => {
    const state = api.getState() as RootState;
    const connectionsWithSameNameCount = Object.values(
      state.connections.entities
    ).filter((conn) => conn?.favorite.name === favorite.name).length;

    const connection: Connection = {
      favorite,
      name: `#${connectionsWithSameNameCount + 1}`,
      id: (Math.random() + "").substring(2),
      query: `select sleep(${Math.ceil(Math.random() * 2000)})`,
      queryResult: null,
      error: null,
      tables: [],
      databases: [],
      currentDatabase: favorite.options.database,
      isLoading: false,
    };

    const options = {
      type: "mysql" as const,
      id: connection.id,
      favoriteId: favorite.id,
      ...favorite.options,
    };

    await dbClient.connect(options);
    const [tables, databases] = await loadMeta(options.id);

    return {
      ...connection,
      tables,
      databases,
    };
  }
);

export const loadMetaForSelectedConnection = createAsyncThunk(
  "connections/loadMeta",
  async (_, api) => {
    const selectedConnectionId = selectSelectedConnectionId(
      api.getState() as RootState
    );

    if (!selectedConnectionId) {
      throw new Error("No connection selected");
    }

    const meta = await loadMeta(selectedConnectionId);

    return { id: selectedConnectionId, meta };
  }
);

export const switchDatabase = createAsyncThunk(
  "connections/switchDatabase",
  async (database: string, api) => {
    const selectedConnectionId = selectSelectedConnectionId(
      api.getState() as RootState
    );

    if (!selectedConnectionId) {
      throw new Error("No connection selected");
    }

    await dbClient.execute(selectedConnectionId, `USE ${database}`);

    api.dispatch(loadMetaForSelectedConnection());

    return database;
  }
);

export const executeQuery = createAsyncThunk(
  "connections/executeQuery",
  async (
    { query, updateLastQuery }: { query: string; updateLastQuery: boolean },
    api
  ) => {
    const connectionId = selectSelectedConnectionId(
      api.getState() as RootState
    );

    if (!connectionId) {
      throw new Error("No connection selected");
    }

    console.debug(`Executing (${connectionId}): ${query}`);

    return dbClient.execute(connectionId, query).then((result) => ({
      ...result,
      query,
      updateLastQuery,
    }));
  }
);

function loadMeta(connectionId: string) {
  return Promise.all([
    dbClient.execute(connectionId, "SHOW TABLES;").then((result) => {
      const col = result.columns[0].name;
      return result.data.map((d: any) => d[col] as string);
    }),
    dbClient.execute(connectionId, "SHOW SCHEMAS;").then((result) => {
      const col = result.columns[0].name;
      return result.data.map((d: any) => d[col] as string);
    }),
  ]);
}

const connectionsSlice = createSlice({
  name: "connections",
  initialState: {
    ...connectionsAdapter.getInitialState(),
    workspaces: {} as Record<string, Workspace>,
    selectedConnectionId: null as string | null,
  },
  reducers: {
    selectConnection(draft, { payload }: { payload: string }) {
      draft.selectedConnectionId = payload;
    },
    setQuery(draft, { payload: query }) {
      const workspace = draft.workspaces[draft.selectedConnectionId || -1];
      if (workspace) {
        workspace.query = query;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(openConnection.fulfilled, (draft, { payload }) => {
      connectionsAdapter.addOne(draft, payload);
      draft.selectedConnectionId = payload.id;
      draft.workspaces[payload.id] = {
        query: "",
        isLoading: false,
        error: null,
        queryResult: null,
      };
    });
    builder.addCase(closeConnection.fulfilled, connectionsAdapter.removeOne);
    builder.addCase(
      switchDatabase.fulfilled,
      (draft, { payload: database }) => {
        const connection = draft.entities[draft.selectedConnectionId || -1];
        if (connection) {
          connection.currentDatabase = database;
        }
      }
    );
    builder.addCase(
      loadMetaForSelectedConnection.fulfilled,
      (draft, { payload }) => {
        const connection = draft.entities[payload.id];
        if (connection) {
          connection.tables = payload.meta[0];
          connection.databases = payload.meta[1];
        }
      }
    );
    builder.addCase(executeQuery.pending, (draft) => {
      console.log("Pending ...");
      const workpalce = draft.workspaces[draft.selectedConnectionId || -1];
      if (workpalce) {
        workpalce.error = null;
        workpalce.isLoading = true;
      }
    });
    builder.addCase(
      executeQuery.fulfilled,
      (draft, { payload: queryResult }) => {
        console.log("Query result", queryResult);
        const workpalce = draft.workspaces[draft.selectedConnectionId || -1];
        if (queryResult.columns) {
          // Select query
          workpalce.queryResult = {
            columns: queryResult.columns,
            data: queryResult.data,
            query: queryResult.updateLastQuery
              ? queryResult.query
              : workpalce.queryResult?.query || queryResult.query,
            ddlStatus: null,
          };
        } else {
          // DDL query
          workpalce.queryResult = {
            columns: workpalce.queryResult?.columns || [],
            data: workpalce.queryResult?.data || [],
            query: workpalce.queryResult?.query || "",
            ddlStatus: queryResult.data as any,
          };
        }
        workpalce.isLoading = false;
      }
    );
    builder.addCase(executeQuery.rejected, (draft, action: any) => {
      console.log("Execution error", action.payload);
      const workpalce = draft.workspaces[draft.selectedConnectionId || -1];
      workpalce.error = action.payload.message;
      workpalce.isLoading = false;
    });
  },
});

// Rename the exports for readability in component usage
export const {
  selectById: selectConnectionById,
  selectAll: selectAllConnections,
} = connectionsAdapter.getSelectors((state: RootState) => state.connections);

const selectConnectionsState = (state: RootState) => state.connections;

export const selectSelectedConnection = createSelector(
  selectConnectionsState,
  (state) => {
    if (!state.selectedConnectionId) {
      return null;
    }

    return state.entities[state.selectedConnectionId] || null;
  }
);

export const selectConnectionTables = createSelector(
  selectSelectedConnection,
  (connection) => connection?.tables || []
);

export const selectConnectionDatabases = createSelector(
  selectSelectedConnection,
  (connection) => connection?.databases || []
);

export const selectSelectedConnectionId = createSelector(
  selectConnectionsState,
  (state) => state.selectedConnectionId
);

export const selectCurrentDatabase = createSelector(
  selectSelectedConnection,
  (state) => state?.currentDatabase || ""
);

export const selectCurrentWorkplace = createSelector(
  selectConnectionsState,
  selectSelectedConnectionId,
  (state, id) => state.workspaces[id || -1] || null
);

export const setQuery = connectionsSlice.actions.setQuery;
export const selectConnection = connectionsSlice.actions.selectConnection;

export default connectionsSlice.reducer;
