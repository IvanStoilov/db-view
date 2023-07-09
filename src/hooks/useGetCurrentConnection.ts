import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export function useGetCurrentConnection() {
  const { connectionId } = useParams();
  const {
    connections: { getConnectionById },
  } = useAppContext();
  return connectionId ? getConnectionById(connectionId) : null;
}
