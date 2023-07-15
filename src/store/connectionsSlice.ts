import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { Connection } from "../model/Connection";
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

    try {
      await dbClient.connect(options);

      return connection;

      // TODO: reloadMeta(connection.id);
    } catch (error: any) {
      // TODO
      // notifications.show({
      //   message: error.message,
      //   color: "red",
      // });
      throw error;
    }
  }
);

const connectionsSlice = createSlice({
  name: "connections",
  initialState: connectionsAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(openConnection.fulfilled, (state, { payload }) => {
      connectionsAdapter.addOne(state, payload);
    });
    builder.addCase(closeConnection.fulfilled, connectionsAdapter.removeOne);
    // builder.addCase(updateConnection.fulfilled, (state, { payload }) => {
    //   const { id, ...changes } = payload;
    //   connectionsAdapter.updateOne(state, { id, changes });
    // });
  },
});

// Rename the exports for readability in component usage
export const {
  selectById: selectConnectionById,
  selectAll: selectAllConnections,
} = connectionsAdapter.getSelectors((state: RootState) => state.connections);

export default connectionsSlice.reducer;
