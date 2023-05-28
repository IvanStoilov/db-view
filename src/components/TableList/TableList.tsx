import React from "react";
import { Connection } from "../../model/Connection";
import { useAppContext } from "../../hooks/AppContext";

function TableList(props: { connection: Connection }) {
  const { connections } = useAppContext();

  return (
    <aside className="menu">
      <ul className="menu-list">{props.connection.tables.map(getTableItem)}</ul>
    </aside>
  );

  function getTableItem(table: string) {
    return (
      <li key={table}>
        <a onDoubleClick={() => handleTableClick(table)}>
          <span>{table}</span>
        </a>
      </li>
    );
  }

  function handleTableClick(tableName: string) {
    connections.execute(props.connection.connectionId, `SELECT * FROM \`${tableName}\` LIMIT 100`)
  }
}

export default TableList;
