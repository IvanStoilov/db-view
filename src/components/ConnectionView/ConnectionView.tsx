import { Box, Group, Stack, createStyles, rem } from "@mantine/core";
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

export function ConnectionView() {
  const { classes } = useStyles();
  
  return (
    <Group h="100vh" spacing={0}>
      <Stack
        w={200}
        h="100vh"
        className={classes.tables}
      >
        <DatabaseSwitcher />
        <TableList />
      </Stack>
      <Box style={{ flex: "1 1 auto" }}>
        <SqlEditor />
      </Box>
    </Group>
  );
}
