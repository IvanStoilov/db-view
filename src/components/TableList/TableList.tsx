import React, { useState } from "react";
import {
  Box,
  Group,
  Input,
  ScrollArea,
  Stack,
  UnstyledButton,
} from "@mantine/core";
import { IconTable } from "@tabler/icons-react";
import { useConnectionsMetaContext } from "../../context/ConnectionsMetaContext";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

function TableList() {
  const { connectionId } = useParams();
  const { getConnectionMeta } = useConnectionsMetaContext();
  const tables = connectionId
    ? getConnectionMeta(connectionId)?.tables || []
    : [];
  const { connections } = useAppContext();

  const [filter, setFilter] = useState("");

  return (
    <Stack style={{ overflow: "hidden" }}>
      <Box>
        <Input
          placeholder="Filter tables ..."
          onChange={(e) => setFilter(e.target.value)}
        />
      </Box>
      <ScrollArea>
        <Stack>{getFilteredTables().map(getTableItem)}</Stack>
      </ScrollArea>
    </Stack>
  );

  function getTableItem(table: string) {
    return (
      <UnstyledButton onClick={() => handleTableClick(table)} key={table}>
        <Group spacing="sm" noWrap>
          <IconTable size={14} stroke={1.2} style={{ flexShrink: 0 }} />
          <Box
            style={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
            title={table}
          >
            {table}
          </Box>
        </Group>
      </UnstyledButton>
    );
  }

  function handleTableClick(tableName: string) {
    if (connectionId) {
      connections.execute(
        connectionId,
        `SELECT * FROM \`${tableName}\` LIMIT 100`
      );
    }
  }

  function getFilteredTables() {
    let filterFn = (table: string) => table.indexOf(filter) > -1;

    try {
      const regexp = new RegExp(filter, "i");
      filterFn = (table: string) => table.match(regexp) !== null;
    } catch {}

    return tables.filter((table) => !filter || filterFn(table));
  }
}

export default TableList;
