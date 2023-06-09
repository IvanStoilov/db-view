import { QueryResult } from "./QueryResult";

export type Favorite = {
  id: string;
  name: string;
  user: string;
  password: string;
  host: string;
  database: string;
  timezone: string;
};

export type Connection = {
  id: string;
  favoriteId: number;
  workspaces: Workspace[];
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
