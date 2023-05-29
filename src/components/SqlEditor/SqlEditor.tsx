import { AgGridReact } from "ag-grid-react";
import { SortChangedEvent } from "ag-grid-community";
import React, { useEffect, useRef } from "react";
import { Editor, OnMount } from "@monaco-editor/react";
import "./SqlEditor.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Connection } from "../../model/Connection";
import { useAppContext } from "../../hooks/AppContext";

function SqlEditor(props: { connection: Connection }) {
  const { connections } = useAppContext();
  const connectionIdRef = useRef(props.connection.connectionId);

  useEffect(() => {
    connectionIdRef.current = props.connection.connectionId;
  }, [props.connection]);

  return (
    <div className="sql-editor">
      <Editor
        value={props.connection.query}
        height="200px"
        defaultLanguage="sql"
        onChange={(v) => connections.setQuery(v || "")}
        onMount={handleOnEditorMount}
        options={{
          minimap: {
            enabled: false,
          },
        }}
      ></Editor>
      <div className="sql-editor__data ag-theme-alpine">
        <AgGridReact
          rowData={props.connection.queryResult?.data}
          columnDefs={props.connection.queryResult?.columns.map((col) => ({
            field: col.name,
            headerName: `${col.name} (${col.type})`,
            editable: false,
            sortable: true,
            resizable: true,
            cellRenderer: (data: any) => {
              const value = data.getValue();
              if (value instanceof Date) {
                return value.toISOString().replace('T', ' ').substring(0, 19)
              }
              return value;
          }    
          }))}
          onSortChanged={handleSortChange}
          suppressContextMenu={true}
          preventDefaultOnContextMenu={true}
          rowHeight={28}
        ></AgGridReact>
      </div>
      {props.connection.error && (
        <div className="notification is-danger my-3">
          <button
            className="delete"
            onClick={() =>
              connections.clearError(props.connection.connectionId)
            }
          ></button>
          {props.connection.error}
        </div>
      )}
    </div>
  );

  function handleOnEditorMount(editor: Parameters<OnMount>[0]) {
    editor.onKeyDown((e) => onEditorKeyDown(e as any));
  }

  function onEditorKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.code === "Enter" && event.metaKey) {
      const textarea = event.target as HTMLTextAreaElement;
      let sql = textarea.value;
      const selectionStart = textarea.selectionStart;

      let start = sql.substring(0, selectionStart).lastIndexOf(";");
      start = start === -1 ? 0 : start + 1;

      let end = sql.substring(selectionStart).indexOf(";");
      end = end === -1 ? sql.length : end + selectionStart;

      sql = sql.substring(start, end).trim();

      connections.execute(connectionIdRef.current, sql);

      event.preventDefault();
      event.stopPropagation();
    }
  }

  function handleSortChange(event: SortChangedEvent<any>) {
    const order = event.columnApi
      .getColumnState()
      .filter((c) => c.sort)
      .map((c) => `dbviewtemptable.\`${c.colId}\` ${c.sort}`)
      .join(", ");

    let sql = props.connection.queryResult?.query;
    if (sql) {
      let limitPos = sql.lastIndexOf("LIMIT");
      let limitAddOn = "";
      if (limitPos > -1) {
        limitAddOn = sql.substring(limitPos);
        sql = sql.substring(0, limitPos);
      }
      if (order) {
        sql = `SELECT * FROM (${sql}) dbviewtemptable ORDER BY ${order}`;
      }
      sql = `${sql} ${limitAddOn}`;
      connections.execute(connectionIdRef.current, sql, false);
    }
  }
}

export default SqlEditor;
