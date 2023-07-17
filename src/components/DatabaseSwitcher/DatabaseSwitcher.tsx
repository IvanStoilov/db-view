import { Select } from "@mantine/core";
import {
  selectConnectionDatabases,
  selectCurrentDatabase,
  switchDatabase,
} from "../../store/connectionsSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";

const SYSTEM_DB: Record<string, true> = {
  information_schema: true,
  mysql: true,
  performance_schema: true,
  sys: true,
};

export function DatabaseSwitcher() {
  const databases = useAppSelector(selectConnectionDatabases);
  const currentDatabase = useAppSelector(selectCurrentDatabase);
  const dispatch = useAppDispatch();

  return (
    <Select
      value={currentDatabase}
      placeholder={currentDatabase}
      data={getDatabases()}
      onChange={(database) => database && dispatch(switchDatabase(database))}
      searchable
      nothingFound="Database not found"
    />
  );

  function getDatabases() {
    return [
      ...(databases.filter((db) => !SYSTEM_DB[db]) || []),
      ...(databases.filter((db) => SYSTEM_DB[db]) || []),
    ];
  }
}
