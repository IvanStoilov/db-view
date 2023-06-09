import * as mysql from "mysql2";

type BasicFields = {
  id: string;
};

export type ConnectionOptions = BasicFields &
  (
    | (mysql.ConnectionOptions & { type: "mysql" })
    | (never & { type: "postgres" })
  );
