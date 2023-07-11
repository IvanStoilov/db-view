import {
  Button,
  Group,
  Navbar,
  ScrollArea,
  Title,
  createStyles,
  rem,
} from "@mantine/core";
import { Favorites } from "./Favorites/Favorites";
import { useAppContext } from "../../context/AppContext";

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
  },

  header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  links: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  footer: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

export function MyNavbar() {
  const { classes } = useStyles();
  const { favorites } = useAppContext();

  return (
    <Navbar height={"100vh"} w={300} p="md" className={classes.navbar}>
      <Navbar.Section className={classes.header}>
        <Group position="left">
          <img src={"/logo/logo.svg"} width="48" alt="DB" />
          <Title order={2}>DB Viewer</Title>
        </Group>
      </Navbar.Section>
      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>
          <Favorites />
        </div>
      </Navbar.Section>

      <Navbar.Section>
        <Button variant="subtle" onClick={() => favorites.add()}>Add favorite</Button>
      </Navbar.Section>
    </Navbar>
  );
}
