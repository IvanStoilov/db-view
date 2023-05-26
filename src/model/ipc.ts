import { Connection } from "./Connection";
import { Favorite } from "./Favorite";
import { QueryResult } from "./QueryResult";

type MysqlClient = {
  connect(connection: Connection): Promise<void>;
  close(connection: Connection): Promise<void>;
  execute(connection: Connection, query: string): Promise<QueryResult>;
};

type Storage = {
  set(key: string, value: Favorite): Promise<void>;
  delete(key: string): Promise<void>;
  getAll(): Promise<Favorite[]>;
};

declare global {
  var mysql: MysqlClient;
  var storage: Storage;

  interface Window {
    mysql: MysqlClient;
    storage: Storage;
  }
}
