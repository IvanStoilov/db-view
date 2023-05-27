import React from "react";
import { Connection } from "../../model/Connection";
import "./ConnectionTabs.css";

export function ConnectionTabs(props: {
  connections: Connection[];
  activeConnection: Connection | null;
  onActivate: (conn: Connection) => void;
  onClose: (conn: Connection) => void;
}) {
  return (
    <div className="navbar-menu">
      <div className="navbar-start">
        {props.connections.map((connection, ind) => (
          <a
            key={connection.connectionId}
            className={
              "navbar-item" +
              (props.activeConnection === connection ? " is-active" : "")
            }
            onClick={() => props.onActivate(connection)}
          >
            <span>{connection.name}</span>
            <button
              className="delete ml-2"
              onClick={() => props.onClose(connection)}
            ></button>
          </a>
        ))}
      </div>
    </div>
  );
}
