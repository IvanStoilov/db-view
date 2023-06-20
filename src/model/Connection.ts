import { Favorite } from "./Favorite";
import { QueryResult } from "./QueryResult";

export type Connection = {
  id: string;
  name: string;
  favorite: Favorite;
  tables: string[];
  databases: string[];
  currentDatabase: string;
  query: string;
  queryResult: QueryResult | null;
  error: string | null;
  isLoading: boolean;
};
