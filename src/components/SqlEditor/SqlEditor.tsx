import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import { SortChangedEvent, CellEditingStoppedEvent } from "ag-grid-community";
import React, { useEffect, useRef, useState } from "react";
import { Editor, OnMount } from "@monaco-editor/react";
import "./SqlEditor.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Connection } from "../../model/Connection";
import { useAppContext } from "../../hooks/AppContext";
import { ResizableBox } from "react-resizable";
import { CustomLoadingOverlay } from "./GridLoadingOverlay";
import { StatusBar } from "./StatusBar";
import { GridCustomHeader } from "./GridCustomHeader";
import SqlString from "sqlstring";
import ModalDialog, { ModalDialogHandle } from "../common/ModalDialog";

const EDITOR_HEIGHT_INITIAL = 100;

// Hack to please sqlstring
window.Buffer = {
  isBuffer: () => false,
} as any;

function SqlEditor(props: { connection: Connection }) {
  const { connections } = useAppContext();
  const [editorHeight, setEditorHeight] = useState(EDITOR_HEIGHT_INITIAL);
  const connectionIdRef = useRef(props.connection.connectionId);
  const grid = useRef<AgGridReact | null>(null);
  const confirmChangeDialogRef = useRef<ModalDialogHandle | null>(null);

  const agGridProps: AgGridReactProps = {
    rowData: props.connection.queryResult?.data,
    columnDefs: props.connection.queryResult?.columns.map((col) => ({
      field: col.name,
      type: col.type.toLowerCase(),
      headerName: `${col.name} (${col.type.toLowerCase()})`,
      headerTooltip: `${col.name} (${col.type.toLowerCase()})`,
      headerComponent: GridCustomHeader,
      headerComponentParams: { type: col.type.toLowerCase() },
      editable: true,
      sortable: true,
      resizable: true,
      cellRenderer: (cell: any) => cellRenderer(cell, col.type.toLowerCase()),
    })),
    stopEditingWhenCellsLoseFocus: true,
    readOnlyEdit: true,
    onCellEditingStopped,
    onSortChanged: handleSortChange,
    suppressContextMenu: true,
    preventDefaultOnContextMenu: true,
    rowHeight: 28,
    onNewColumnsLoaded: (e) => e.columnApi.autoSizeAllColumns(),
    enableCellTextSelection: true,
    suppressCellFocus: true,
    loadingOverlayComponent: CustomLoadingOverlay,
    loadingOverlayComponentParams: {
      onCancel: () => mysql.cancelExecution(connectionIdRef.current),
    },
    onGridReady: (e) => e.api.hideOverlay(),
  };

  useEffect(() => {
    connectionIdRef.current = props.connection.connectionId;
  }, [props.connection]);

  return (
    <div className="sql-editor">
      <ResizableBox
        height={EDITOR_HEIGHT_INITIAL}
        minConstraints={[0, 50]}
        onResize={(event, { size }) => setEditorHeight(size.height)}
        axis="y"
        handle={(handleAxis, ref) => (
          <div className="sql-editor__resize-handle" ref={ref}>
            <div className="sql-editor__resize-handle-inner has-background-light"></div>
          </div>
        )}
      >
        <Editor
          value={props.connection.query}
          height={editorHeight}
          defaultLanguage="sql"
          onChange={(v) => connections.setQuery(v || "")}
          onMount={handleOnEditorMount}
          options={{
            minimap: {
              enabled: false,
            },
          }}
        ></Editor>
      </ResizableBox>
      <div
        className="sql-editor__data ag-theme-alpine"
        style={{
          height: `calc(100% - 6px - ${editorHeight}px - 24px)`,
        }}
      >
        <AgGridReact ref={grid} {...agGridProps}></AgGridReact>
      </div>
      <div style={{ height: "24px" }}>
        <StatusBar result={props.connection.queryResult} />
      </div>
      {props.connection.error && (
        <div className="sql-editor__error notification is-danger my-3">
          <button
            className="delete"
            onClick={() =>
              connections.clearError(props.connection.connectionId)
            }
          ></button>
          {props.connection.error}
        </div>
      )}
      <ModalDialog ref={confirmChangeDialogRef}></ModalDialog>
    </div>
  );

  function handleOnEditorMount(editor: Parameters<OnMount>[0]) {
    editor.onKeyDown((e) => {
      onEditorKeyDown(e as any, editor);
    });
  }

  function onEditorKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
    editor: Parameters<OnMount>[0]
  ) {
    if (event.code === "Enter" && event.metaKey) {
      const pos = editor.getPosition();
      const selectionStart =
        editor.getModel()?.getOffsetAt(pos || { lineNumber: 1, column: 1 }) ||
        0;

      let sql = editor.getValue().trim().replace(/;+$/g, '');

      let start = sql.substring(0, selectionStart).lastIndexOf(";");
      start = start === -1 ? 0 : start + 1;

      let end = sql.substring(selectionStart).indexOf(";");
      end = end === -1 ? sql.length : end + selectionStart;

      sql = sql.substring(start, end).trim();

      grid.current?.api.showLoadingOverlay();
      connections.execute(connectionIdRef.current, sql).finally(() => {
        grid.current?.api.hideOverlay();
      });

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

  function cellRenderer(data: any, colType: string) {
    const value = data.getValue();
    if (value instanceof Date) {
      return value.toISOString().replace("T", " ").substring(0, 19);
    }
    if (colType === "json") {
      return JSON.stringify(value);
    }
    return value;
  }

  async function onCellEditingStopped(event: CellEditingStoppedEvent<any>) {
    if (event.newValue === event.oldValue) {
      return;
    }

    const columns = props.connection.queryResult?.columns || [];
    const columnData = columns.find((c) => c.name === event.colDef.field);

    if (columns.length && columnData && event.colDef.field) {
      const field = event.colDef.field;
      const table = columnData.table;
      const db = columnData.db;

      const result = await mysql.execute(
        props.connection.connectionId,
        `
      SELECT COLUMN_NAME as col
      FROM information_schema.COLUMNS
      WHERE TABLE_NAME = '${table}' 
        AND TABLE_SCHEMA = '${db}' 
        AND COLUMN_KEY = 'PRI'
      `
      );

      if (result.data.length > 0) {
        const primaryKeyColumns = result.data.map((d) => d.col);
        const primaryKeyValues = primaryKeyColumns.map(
          (col) => event.data[col]
        );

        if (primaryKeyValues.every((v) => typeof v !== "undefined")) {
          const where = primaryKeyColumns
            .map((col) => `${col} = ?`)
            .join(" AND ");
          const newSql = SqlString.format(`UPDATE ? SET ? = ? WHERE ${where}`, [
            SqlString.raw(table),
            SqlString.raw(field),
            event.newValue,
            ...primaryKeyValues,
          ]);

          confirmChangeDialogRef.current?.open({
            content: (
              <span>
                <p className="mb-3">The following query will be executed:</p>
                <pre>{newSql}</pre>
              </span>
            ),
            onOk: async () => {
              await connections.execute(props.connection.connectionId, newSql);
              event.node.setData({
                ...event.node.data,
                [field]: event.newValue,
              });
            },
          });
        } else {
          confirmChangeDialogRef.current?.open({
            content:
              "This field cannot be modified because the primary key is not present in the result set.",
          });
        }
      }
    }
  }
}

export default SqlEditor;
