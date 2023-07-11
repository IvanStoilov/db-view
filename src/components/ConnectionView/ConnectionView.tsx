import { Alert, Box, Group, Stack, createStyles, rem } from "@mantine/core";
import { useAppContext } from "../../context/AppContext";
import { DatabaseSwitcher } from "../DatabaseSwitcher/DatabaseSwitcher";
import SqlEditor from "../SqlEditor/SqlEditor";
import TableList from "../TableList/TableList";
import "./ConnectionView.css";
import { useParams } from "react-router-dom";
import { useCallback } from "react";
import { useConnectionsMetaContext } from "../../context/ConnectionsMetaContext";

const useStyles = createStyles((theme) => ({
  tables: {
    overflow: "hidden",
    padding: `${rem(15)} ${rem(15)} 0 0`,
    borderRight: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

export function ConnectionView() {
  const { classes } = useStyles();
  const { connections } = useAppContext();
  const { connectionId } = useParams();
  const { getConnectionMeta, switchDatabase } = useConnectionsMetaContext();

  const loadTableData = useCallback(
    (tableName: string) => {
      if (connectionId) {
        connections.execute(
          connectionId,
          `SELECT * FROM \`${tableName}\` LIMIT 100`
        );
      }
    },
    [connectionId]
  );

  const switchDbCallback = useCallback(
    (database: string) => {
      if (connectionId) {
        switchDatabase(connectionId, database)
      }
    },
    [connectionId]
  );

  if (!connectionId) {
    return <Alert color="red">Connection id not passed.</Alert>;
  }

  const meta = getConnectionMeta(connectionId);

  if (!meta) {
    return <Alert color="red">Meta not found for connection {connectionId}.</Alert>;
  }

  return (
    <Group h="100vh" spacing={0}>
      <Stack w={200} h="100vh" className={classes.tables}>
        <DatabaseSwitcher
          currentDatabase={meta.currentDatabase || ""}
          databases={meta.databases || []}
          onSwitch={switchDbCallback}
        />
        <TableList tables={meta.tables || []} onTableClick={loadTableData} />
      </Stack>
      <Box style={{ flex: "1 1 auto" }}>
        <SqlEditor />
      </Box>
    </Group>
  );
}
