import React, { memo, useState } from "react";
import {
  Box,
  Group,
  Input,
  ScrollArea,
  Stack,
  UnstyledButton,
} from "@mantine/core";
import { IconTable } from "@tabler/icons-react";

function TableList(props: {
  tables: string[];
  onTableClick: (table: string) => void;
}) {
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
      <UnstyledButton onClick={() => props.onTableClick(table)} key={table}>
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

  function getFilteredTables() {
    let filterFn = (table: string) => table.indexOf(filter) > -1;

    try {
      const regexp = new RegExp(filter, "i");
      filterFn = (table: string) => table.match(regexp) !== null;
    } catch {}

    return props.tables.filter((table) => !filter || filterFn(table));
  }
}

export default memo(TableList);
