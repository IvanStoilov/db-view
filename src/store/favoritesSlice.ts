import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { Favorite } from "../model/Favorite";
import { RootState } from "./store";

export const favoritesAdapter = createEntityAdapter<Favorite>();

export const fetchFavorites = createAsyncThunk("favorites/fetch", () =>
  storage.getAll()
);
export const addFavorite = createAsyncThunk("favorites/add", async () => {
  const newFavorite: Favorite = {
    id: (Math.random() + "").substring(2),
    name: "New favorite",
    options: {
      database: "",
      host: "",
      password: "",
      user: "",
      timezone: "UTC",
    },
  };

  await storage.set(newFavorite.id, newFavorite);

  return newFavorite;
});
export const removeFavorite = createAsyncThunk(
  "favorites/remove",
  async (id: string) => {
    await storage.delete(id);
    return id;
  }
);
export const updateFavorite = createAsyncThunk(
  "favorites/update",
  async (payload: { id: string; updated: Favorite }) => {
    await storage.set(payload.id, payload.updated);
    return payload.updated;
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: favoritesAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFavorites.fulfilled, favoritesAdapter.upsertMany);
    builder.addCase(addFavorite.fulfilled, (state, { payload }) => {
      favoritesAdapter.addOne(state, payload);
    });
    builder.addCase(removeFavorite.fulfilled, favoritesAdapter.removeOne);
    builder.addCase(updateFavorite.fulfilled, (state, { payload }) => {
      const { id, ...changes } = payload;
      favoritesAdapter.updateOne(state, { id, changes });
    });
  },
});

// Rename the exports for readability in component usage
export const { selectById: selectFavoriteById, selectAll: selectAllFavorites } =
  favoritesAdapter.getSelectors((state: RootState) => state.favorites);

export default favoritesSlice.reducer;
