import { Select } from "@mantine/core";
import { useConnectionsMetaContext } from "../../context/ConnectionsMetaContext";
import { useParams } from "react-router-dom";

const SYSTEM_DB: Record<string, true> = {
  information_schema: true,
  mysql: true,
  performance_schema: true,
  sys: true,
};

export function DatabaseSwitcher() {
  const { connectionId } = useParams();
  const connectionsMeta = useConnectionsMetaContext();
  const meta = connectionId
    ? connectionsMeta.getConnectionMeta(connectionId)
    : null;

  if (!meta) {
    return null;
  }

  return (
    <Select
      value={meta.currentDatabase}
      placeholder={meta.currentDatabase}
      data={getDatabases()}
      onChange={(database) =>
        database &&
        connectionId &&
        connectionsMeta.switchDatabase(connectionId, database)
      }
      searchable
      nothingFound="Database not found"
    />
  );

  function getDatabases() {
    return [
      ...(meta?.databases.filter((db) => !SYSTEM_DB[db]) || []),
      ...(meta?.databases.filter((db) => SYSTEM_DB[db]) || []),
    ];
  }
}
