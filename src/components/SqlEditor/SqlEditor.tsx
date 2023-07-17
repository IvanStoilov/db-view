import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import { SortChangedEvent, CellEditingStoppedEvent } from "ag-grid-community";
import React, { useMemo, useRef, useState } from "react";
import { Editor, OnMount } from "@monaco-editor/react";
import "./SqlEditor.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ResizableBox } from "react-resizable";
import { CustomLoadingOverlay } from "./GridLoadingOverlay";
import { StatusBar } from "./StatusBar";
import { GridCustomHeader } from "./GridCustomHeader";
import SqlString from "sqlstring";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { Alert, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  selectSelectedConnection,
  setQuery,
  executeQuery as executeQueryAction,
  selectCurrentWorkplace,
} from "../../store/connectionsSlice";

const EDITOR_HEIGHT_INITIAL = 100;

// Hack to please sqlstring
window.Buffer = {
  isBuffer: () => false,
} as any;

function SqlEditor() {
  const connection = useAppSelector(selectSelectedConnection);
  const workspace = useAppSelector(selectCurrentWorkplace);
  const dispatch = useAppDispatch();

  const [editorHeight, setEditorHeight] = useState(EDITOR_HEIGHT_INITIAL);
  const grid = useRef<AgGridReact | null>(null);
  const agGridProps: AgGridReactProps = useMemo(
    () =>
      !connection
        ? {}
        : {
            rowData: workspace.queryResult?.data,
            columnDefs: workspace.queryResult?.columns.map((col) => ({
              field: col.name,
              type: col.type.toLowerCase(),
              headerName: `${col.name} (${col.type.toLowerCase()})`,
              headerTooltip: `${col.name} (${col.type.toLowerCase()})`,
              headerComponent: GridCustomHeader,
              headerComponentParams: { type: col.type.toLowerCase() },
              editable: true,
              sortable: true,
              resizable: true,
              cellRenderer: (cell: any) =>
                cellRenderer(cell, col.type.toLowerCase()),
            })),
            suppressFieldDotNotation: true,
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
              onCancel: () =>
                connection && dbClient.cancelExecution(connection.id),
            },
            onGridReady: (e) => e.api.hideOverlay(),
          },
    [workspace?.queryResult]
  );

  if (!connection) {
    return null;
  }

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
          value={connection.query}
          height={editorHeight}
          defaultLanguage="sql"
          onChange={(v) => dispatch(setQuery(v || ""))}
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
          height: `calc(100% - 7px - ${editorHeight}px - 24px)`,
        }}
      >
        <AgGridReact ref={grid} {...agGridProps}></AgGridReact>
      </div>
      <div style={{ height: "24px" }}>
        <StatusBar result={workspace.queryResult} />
      </div>
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

      let sql = editor.getValue().trim().replace(/;+$/g, "");

      let start = sql.substring(0, selectionStart).lastIndexOf(";");
      start = start === -1 ? 0 : start + 1;

      let end = sql.substring(selectionStart).indexOf(";");
      end = end === -1 ? sql.length : end + selectionStart;

      sql = sql.substring(start, end).trim();

      executeQuery(sql);

      event.preventDefault();
      event.stopPropagation();
    }
  }

  async function executeQuery(query: string, updateLastQuery = true) {
    if (!connection) {
      return;
    }

    const executionId = Math.random() + "";
    notifications.clean();
    notifications.show({
      id: executionId,
      title: "Query execution",
      message: "Executing ...",
      withCloseButton: true,
      autoClose: false,
      loading: true,
      onClose: (props) => {
        notifications.update({
          id: executionId,
          message: "Cancelling ...",
        });
        dbClient
          .cancelExecution(connection.id)
          .then(() => {
            notifications.update({
              id: executionId,
              message: "Cancelled",
              autoClose: 500,
            });
          })
          .catch((error) => {
            notifications.show({
              message: error.message,
              color: "red",
              autoClose: false,
            });
          });
      },
    });

    await dbClient.cancelExecution(connection.id);

    dispatch(executeQueryAction({ query, updateLastQuery }))
      .then(() => {
        notifications.update({
          id: executionId,
          message: "Done",
          autoClose: 500,
        });
      })
      .catch((error) => {
        notifications.update({
          id: executionId,
          message: error.message,
          color: "red",
          autoClose: false,
        });
      });
  }

  function handleSortChange(event: SortChangedEvent<any>) {
    const order = event.columnApi
      .getColumnState()
      .filter((c) => c.sort)
      .map((c) => `dbviewtemptable.\`${c.colId}\` ${c.sort}`)
      .join(", ");

    let sql = workspace?.queryResult?.query;
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
      executeQuery(sql, false);
    }
  }

  function cellRenderer(data: any, colType: string) {
    const value = data.getValue();
    if (value instanceof Date) {
      return value.toISOString().replace("T", " ").substring(0, 19);
    }
    if (value === null) {
      return "NULL";
    }
    if (colType === "json") {
      return JSON.stringify(value);
    }

    return value;
  }

  async function onCellEditingStopped(event: CellEditingStoppedEvent<any>) {
    if (event.newValue === event.oldValue || !connection) {
      return;
    }

    const columns = workspace.queryResult?.columns || [];
    const columnData = columns.find((c) => c.name === event.colDef.field);

    if (columns.length && columnData && event.colDef.field) {
      const field = event.colDef.field;
      const table = columnData.table;
      const db = columnData.db;

      const result = await dbClient.execute(
        connection.id,
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

          modals.openConfirmModal({
            title: "Confirm update",
            children: (
              <Alert
                icon={<IconAlertCircle size="1rem" />}
                title="To execute"
                color="red"
              >
                <pre style={{ whiteSpace: "break-spaces", padding: 0 }}>
                  {newSql}
                </pre>
              </Alert>
            ),
            labels: { confirm: "Confirm", cancel: "Cancel" },
            onConfirm: async () => {
              await executeQuery(newSql, false);
              event.node.setData({
                ...event.node.data,
                [field]: event.newValue,
              });
            },
          });
        } else {
          modals.openConfirmModal({
            title: "Update impossible",
            children: (
              <Text size="md">
                This field cannot be modified because the primary key is not
                present in the result set.
              </Text>
            ),
            labels: { confirm: "OK", cancel: "Close" },
            confirmProps: {
              hidden: true,
            },
          });
        }
      }
    }
  }
}

export default SqlEditor;
