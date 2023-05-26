import React, { useEffect, useState } from "react";
import { Connection } from "../../model/Connection";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

function TableList(props: { connection: Connection }) {
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    if (props.connection) {
      mysql.execute(props.connection.connectionId, "SHOW TABLES;").then((result) => {
        const col = result.columns[0].name;
        setTables(result.data.map((d: any) => d[col]));
      });
    }
  }, [props.connection]);

  return (
    <aside className="menu tables-list-menu">
      <ul className="menu-list">{tables.map(getTableItem)}</ul>
    </aside>
  );

  function getTableItem(table: string) {
    return (
      <li key={table}>
        <a>
          <span>{table}</span>
        </a>
      </li>
    );
  }
}

export default TableList;
