import { AgGridReact } from "ag-grid-react";
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

  function handleOnEditorMount(editor: Parameters<OnMount>[0]) {
    editor.onKeyDown((e) => onEditorKeyDown(e as any));
    // editor.addAction({
    //   id: "execute-sql-query",
    //   label: "Execute query",
    //   keybindings: [KeyMod.CtrlCmd | KeyCode.KeyR],
    //   keybindingContext: "textInputFocus",
    //   run(editor, ...args) {
    //     const pos = editor.getPosition();
    //     const model = editor.getModel();
    //     if (pos && model) {
    //       console.log();
    //       const prev = model.findPreviousMatch(
    //         ";",
    //         pos,
    //         false,
    //         false,
    //         null,
    //         false
    //       );
    //       const next = model.findNextMatch(";", pos, false, false, null, false);
    //       console.log({ prev: prev?.range, next: next?.range });

    //       const startPos: IPosition = {
    //         column: prev?.range.endColumn || 0,
    //         lineNumber: prev?.range.endLineNumber || 0,
    //       };

    //       const endPos: IPosition = {
    //         column: model.getLineLastNonWhitespaceColumn(model.getLineCount()),
    //         lineNumber: model.getLineCount(),
    //       };

    //       const range: IRange = {
    //         startColumn: startPos.column,
    //         startLineNumber: startPos.lineNumber,
    //         endColumn: endPos.column,
    //         endLineNumber: endPos.lineNumber,
    //       };

    //       const query = model.getValueInRange(range);
    //       console.log(query);

    //       connections.execute(props.connection.connectionId, query);
    //     }
    //   },
    // });
    // editor.onKeyDown((e) => onEditorKeyDown(e as any));
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
}

export default SqlEditor;
