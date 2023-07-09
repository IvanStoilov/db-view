import { Select } from "@mantine/core";
import { memo } from "react";

const SYSTEM_DB: Record<string, true> = {
  information_schema: true,
  mysql: true,
  performance_schema: true,
  sys: true,
};

function Inner(props: {
  currentDatabase: string,
  databases: string[],
  onSwitch: (database: string) => void
}) {
  return (
    <Select
      value={props.currentDatabase}
      data={getDatabases()}
      onChange={props.onSwitch}
      searchable
      nothingFound="Database not found"
    />
  );

  function getDatabases() {
    return [
      ...(props?.databases.filter((db) => !SYSTEM_DB[db]) || []),
      ...(props?.databases.filter((db) => SYSTEM_DB[db]) || []),
    ];
  }
}

export const DatabaseSwitcher = memo(Inner);
