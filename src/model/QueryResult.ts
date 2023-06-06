export type QueryResult = {
  columns: Array<{
    name: string;
    type: string;
    db: string;
    table: string;
  }>;
  data: any[];
  query: string;
  ddlStatus: null | {
    affectedRows: number;
    fieldCount: number;
    insertId: number;
    stateChanges: {
      schema: string;
    };
  };
};
