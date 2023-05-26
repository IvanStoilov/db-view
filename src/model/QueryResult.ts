export type QueryResult = {
  columns: Array<{
    name: string;
    type: number;
  }>;
  data: any[];
};
