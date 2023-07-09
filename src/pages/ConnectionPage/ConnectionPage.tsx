import { useParams } from "react-router-dom";
import { Alert } from "@mantine/core";
import { ConnectionView } from "../../components/ConnectionView/ConnectionView";
import { useAppContext } from "../../context/AppContext";

export function ConnectionPage() {
  return <ConnectionView />;
}
