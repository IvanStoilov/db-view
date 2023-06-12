import type { DbClient } from "../../shared/DbClient";
import { Favorite } from "./Favorite";

type Storage = {
  set(key: string, value: Favorite): Promise<void>;
  delete(key: string): Promise<void>;
  getAll(): Promise<Favorite[]>;
};

declare global {
  var dbClient: DbClient;
  var storage: Storage;

  interface Window {
    dbClient: DbClient;
    storage: Storage;
  }
}
