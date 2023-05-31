import React, { useState } from "react";
import { Connection } from "../../model/Connection";
import { useAppContext } from "../../hooks/AppContext";

function TableList(props: { connection: Connection }) {
  const { connections } = useAppContext();
  const [filter, setFilter] = useState("");

  return (
    <aside className="menu">
      <div className="px-1">
        <input
          type="text"
          className="input"
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <ul className="menu-list">{getFilteredTables().map(getTableItem)}</ul>
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
    connections.execute(
      props.connection.connectionId,
      `SELECT * FROM \`${tableName}\` LIMIT 100`
    );
  }

  function getFilteredTables() {
    let filterFn = (table: string) => table.indexOf(filter) > -1;

    try {
      const regexp = new RegExp(filter, "i");
      filterFn = (table: string) => table.match(regexp) !== null;
    } catch {}

    return props.connection.tables.filter(
      (table) => !filter || filterFn(table)
    );
  }
}

export default TableList;
