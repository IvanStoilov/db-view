import "../../model/ipc";
import "./App.css";
import React from "react";
import { ModalDialog } from "../common/ModalDialog";
import { Notifications } from "@mantine/notifications";
import { Router } from "../../pages/Router/Router";

function App() {
  return (
    <div>
      <Router />
      <ModalDialog />
      <Notifications position="bottom-right" />
    </div>
  );
}

export default App;
