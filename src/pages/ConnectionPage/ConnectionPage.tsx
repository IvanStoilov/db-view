import { useParams } from "react-router-dom";
import { Alert } from "@mantine/core";
import { ConnectionView } from "../../components/ConnectionView/ConnectionView";
import { useAppContext } from "../../context/AppContext";

export function ConnectionPage() {
  const { connectionId } = useParams();
  const { connections } = useAppContext();
  const connection = connections.items.find((conn) => conn.id === connectionId);

  if (!connection) {
    return <Alert>Connection not found. (connectionId = {connectionId})</Alert>;
  }

  return <ConnectionView connection={connection} />;
}