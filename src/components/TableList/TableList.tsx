import React from "react";
import { Connection } from "../../model/Connection";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

function TableList(props: { connection: Connection }) {
  return (
    <aside className="menu tables-list-menu">
      <ul className="menu-list">{props.connection.tables.map(getTableItem)}</ul>
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
