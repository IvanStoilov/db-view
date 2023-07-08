import { useAppContext } from "../../hooks/AppContext";
import { Connection } from "../../model/Connection";
import { DatabaseSwitcher } from "../DatabaseSwitcher/DatabaseSwitcher";
import SqlEditor from "../SqlEditor/SqlEditor";
import TableList from "../TableList/TableList";
import "./ConnectionView.css";

export function ConnectionView(props: { connection: Connection }) {
  const { connections } = useAppContext();
  return (
    <div className="connection-view">
      <div className="connection-view__tables">
        <DatabaseSwitcher
          databases={props.connection.databases}
          currentDatabase={props.connection.currentDatabase}
          onSwitch={(db) => connections.switchDatabase(props.connection.id, db)}
        />
        <TableList connection={props.connection} />
      </div>
      <div className="connection-view__editor">
        <SqlEditor connection={props.connection} />
      </div>
    </div>
  );
}
