import { AgGridReact } from "ag-grid-react";
import React, { useRef, useState } from "react";
import { Connection } from "../../model/Favorite";
import * as E from "@monaco-editor/react";

import "./SqlEditor.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

function SqlEditor(props: { connection: Connection; isVisible: boolean }) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [rowData, setRowData] = useState(null);
  const [columnDefs, setColumnDefs] = useState(null);

  function handleOnEditorMount(editor: Parameters<E.OnMount>[0]) {
    editor.onKeyDown((e) => onEditorKeyDown(e as any));
  }

  return (
    <div className={"sql-editor" + (props.isVisible ? "" : " is-hidden")}>
      <E.Editor
        defaultValue={query}
        height="200px"
        defaultLanguage="sql"
        onChange={(v) => setQuery(v || "")}
        onMount={handleOnEditorMount}
        options={{
          minimap: {
            enabled: false,
          },
        }}
      ></E.Editor>
      <div className="sql-editor__data ag-theme-alpine">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          suppressContextMenu={true}
          preventDefaultOnContextMenu={true}
        ></AgGridReact>
      </div>
      {error && (
        <div className="notification is-danger my-3">
          <button className="delete" onClick={() => setError(null)}></button>
          {error}
        </div>
      )}
    </div>
  );

  function handleSubmit(query: string) {
    setIsExecuting(true);
    setError(null);

    console.debug("Executing", query);

    window.mysql
      .execute(props.connection, query)
      .then((result: any) => {
        console.debug(result);
        setRowData(result.data);
        setColumnDefs(
          result.columns.map((col: any) => ({
            field: col.name,
            headerName: `${col.name} (${col.type})`,
            editable: false,
          }))
        );
        setIsExecuting(false);
      })
      .catch((error: Error) => {
        console.error(error);
        setError(error.message);
        setIsExecuting(false);
      });
  }

  function onEditorKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.code === "Enter" && event.metaKey) {
      const textarea = event.target as HTMLTextAreaElement;
      let sql = textarea.value;
      const selectionStart = textarea.selectionStart;

      console.log({ selectionStart, sql })

      let start = sql.substring(0, selectionStart).lastIndexOf(";");
      start = start === -1 ? 0 : start + 1;

      let end = sql.substring(selectionStart).indexOf(";");
      end = end === -1 ? sql.length : end + selectionStart;

      sql = sql.substring(start, end).trim();
      
      handleSubmit(sql);
    }

    localStorage.setItem("query", query);
  }
}

export default SqlEditor;
