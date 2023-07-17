import { Favorite } from "./Favorite";
import { QueryResult } from "./QueryResult";

export type Connection = Workspace & {
  id: string;
  name: string;
  favorite: Favorite;
  tables: string[];
  databases: string[];
  currentDatabase: string;
};

export type Workspace = {
  query: string;
  queryResult: QueryResult | null;
  error: string | null;
  isLoading: boolean;
};
