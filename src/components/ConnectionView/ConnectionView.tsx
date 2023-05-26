import { Connection } from "../../model/Favorite";
import SqlEditor from "../SqlEditor/SqlEditor";
import TableList from "../TableList/TableList";
import "./ConnectionView.css";

export function ConnectionView(props: {
  connection: Connection;
  isVisible: boolean;
}) {
  return (
    <div className={"connection-view" + (props.isVisible ? "" : " is-hidden")}>
      <div className="sidebar">
        {props.isVisible && <TableList connection={props.connection} />}
      </div>
      <div className="connection-view__editor">
        <SqlEditor connection={props.connection} />
      </div>
    </div>
  );
}
