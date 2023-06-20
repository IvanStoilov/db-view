import * as mysql from "mysql2";

type BasicFields = {
  id: string;
};

export type ConnectionOptions = BasicFields &
  (
    | {
        type: "mysql";
        database: string;
        host: string;
        password: string;
        user: string;
        timezone: string;
      }
    | (never & { type: "postgres" })
  );
