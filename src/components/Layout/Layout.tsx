import { Outlet } from "react-router-dom";
import { MyNavbar } from "./Navbar";
import { Container,Grid } from "@mantine/core";

export function Layout() {
  return (
    <Container p={0} m={0} fluid>
      <Grid p={0}>
        <Grid.Col span="content">
          <MyNavbar />
        </Grid.Col>
        <Grid.Col span="auto">
          <Outlet />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
