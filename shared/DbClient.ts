import { ConnectionOptions } from "./ConnectionOptions";
import { QueryResult } from "./QueryResult";

export interface DbClient {
  connect(connection: ConnectionOptions): Promise<void>;
  close(connectionId: string): Promise<void>;
  execute(connectionId: string, query: string): Promise<QueryResult>;
  cancelExecution(connectionId: string): Promise<void>;
}
