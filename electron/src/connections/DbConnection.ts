export interface DbConnection {
  connect(): Promise<void>;
  close(): Promise<void>;
  execute(query: string): Promise<any>;
  cancelExecution(): Promise<void>;
  fetchTables(): Promise<string>;
  fetchSchemas(): Promise<string>;
}
