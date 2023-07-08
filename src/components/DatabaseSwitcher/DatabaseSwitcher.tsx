import { Select } from "@mantine/core";

const SYSTEM_DB: Record<string, true> = {
  information_schema: true,
  mysql: true,
  performance_schema: true,
  sys: true,
};

export function DatabaseSwitcher(props: {
  databases: string[];
  currentDatabase: string;
  onSwitch: (db: string) => void;
}) {
  return (
    <Select
      value={props.currentDatabase}
      placeholder={props.currentDatabase}
      data={getDatabases()}
      onChange={props.onSwitch}
      searchable
      nothingFound="Database not found"
    />
  );

  function getDatabases() {
    return [
      ...props.databases.filter((db) => !SYSTEM_DB[db]),
      ...props.databases.filter((db) => SYSTEM_DB[db]),
    ];
  }
}
