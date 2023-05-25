import { AgGridReact } from "ag-grid-react";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Favorite } from "../../model/Favorite";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

function SqlEditor(props: { favorite: Favorite }) {
  const [isConnecting, setIsConnecting] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isMetaPressed, setIsMetaPressed] = useState(false);
  const [query, setQuery] = useState(localStorage.getItem("query") || "");
  const [error, setError] = useState<string | null>(null);
  const [rowData, setRowData] = useState(null);
  const [columnDefs, setColumnDefs] = useState(null);

  useEffect(() => {
    setIsConnecting(true);
    (window as any).mysql
      .connect(props.favorite)
      .then(() => setIsConnecting(false));
  }, [props.favorite]);

  return (
    <div>
      {isConnecting && <div>Connecting ...</div>}
      {!isConnecting && getEditor()}
    </div>
  );

  function getEditor() {
    return (
      <div>
        <Formik
          initialValues={{ sqlQuery: query }}
          onSubmit={(form) => handleSubmit(form.sqlQuery)}
        >
          <Form>
            <div className="field">
              <div className="control">
                <Field
                  name="sqlQuery"
                  type="text"
                  as="textarea"
                  onKeyDown={onEditorKeyDown}
                  onKeyUp={onEditorKeyUp}
                />
              </div>
            </div>
            <div>
              <button className="button is-primary" type="submit">
                Submit
              </button>
            </div>
          </Form>
        </Formik>
        <div
          className="ag-theme-alpine"
          style={{ width: "100%", height: "500px" }}
        >
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            suppressContextMenu={true}
            preventDefaultOnContextMenu={true}
          ></AgGridReact>
        </div>
        {error && <div>{error}</div>}
      </div>
    );
  }

  function handleSubmit(query: string) {
    setIsExecuting(true);
    setError(null);

    console.debug("Executing", query);

    (window as any).mysql
      .execute(props.favorite, query)
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
    if (event.key === "Meta") {
      setIsMetaPressed(true);
    } else if (event.key === "Enter" && isMetaPressed) {
      let query = event.currentTarget.value;

      const { selectionStart, selectionEnd } = event.currentTarget;

      if (selectionStart !== selectionEnd) {
        query = query.substring(selectionStart, selectionEnd);
      } else {
        let start = query.substring(0, selectionStart).lastIndexOf(";");
        start = start === -1 ? 0 : start + 1;

        let end = query.substring(selectionStart).indexOf(";");
        end = end === -1 ? query.length : (end + selectionStart);

        query = query.substring(start, end).trim();
        console.log({ selectionStart, start, end, query });
      }

      handleSubmit(query);
    }

    localStorage.setItem("query", event.currentTarget.value);
  }

  function onEditorKeyUp(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Meta") {
      setIsMetaPressed(false);
    }
  }
}

export default SqlEditor;
