import { Favorite } from "./Favorite";
import { QueryResult } from "./QueryResult";

export type Connection = {
  favorite: Favorite;
  name: string;
  connectionId: string;
  query: string;
  queryResult: QueryResult | null;
  error: string | null;
  isLoading: boolean;
  tables: string[];
};
