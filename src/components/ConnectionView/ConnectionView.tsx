import { Box, Grid, Group, Stack, createStyles, rem } from "@mantine/core";
import { useAppContext } from "../../context/AppContext";
import { Connection } from "../../model/Connection";
import { DatabaseSwitcher } from "../DatabaseSwitcher/DatabaseSwitcher";
import SqlEditor from "../SqlEditor/SqlEditor";
import TableList from "../TableList/TableList";
import "./ConnectionView.css";

const useStyles = createStyles((theme) => ({
  tables: {
    overflow: "hidden",
    padding: `${rem(15)} ${rem(15)} 0 0`,
    borderRight: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`
  }
}));

export function ConnectionView(props: { connection: Connection }) {
  const { connections } = useAppContext();
  const { classes } = useStyles();
  return (
    <Group h="100vh" spacing={0}>
      <Stack
        w={200}
        h="100vh"
        className={classes.tables}
      >
        <DatabaseSwitcher
          databases={props.connection.databases}
          currentDatabase={props.connection.currentDatabase}
          onSwitch={(db) => connections.switchDatabase(props.connection.id, db)}
        />
        <TableList connection={props.connection} />
      </Stack>
      <Box style={{ flex: "1 1 auto" }}>
        <SqlEditor connection={props.connection} />
      </Box>
    </Group>
  );
}
