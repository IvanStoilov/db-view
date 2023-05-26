import { AgGridReact } from "ag-grid-react";
import React, { useState } from "react";
import { Editor, OnMount } from "@monaco-editor/react";

import "./SqlEditor.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Connection } from "../../model/Connection";
import { useAppContext } from "../../hooks/AppContext";

function SqlEditor(props: { connection: Connection }) {
  const { connections } = useAppContext();

  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleOnEditorMount(editor: Parameters<OnMount>[0]) {
    editor.onKeyDown((e) => onEditorKeyDown(e as any));
  }

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
          }))}
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

    connections.execute(props.connection.connectionId, query);

    // window.mysql
    //   .execute(props.connection.connectionId, query)
    //   .then((result: any) => {
    //     console.debug(result);
    //     setRowData(result.data);
    //     setColumnDefs(
    //       result.columns.map((col: any) => ({
    //         field: col.name,
    //         headerName: `${col.name} (${col.type})`,
    //         editable: false,
    //       }))
    //     );
    //     setIsExecuting(false);
    //   })
    //   .catch((error: Error) => {
    //     console.error(error);
    //     setError(error.message);
    //     setIsExecuting(false);
    //   });
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

      handleSubmit(sql);

      event.preventDefault();
      event.stopPropagation();
    }
  }
}

export default SqlEditor;
