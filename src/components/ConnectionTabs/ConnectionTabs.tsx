import React from "react";
import { Connection } from "../../model/Favorite";
import "./ConnectionTabs.css";

export function ConnectionTabs(props: {
  connections: Connection[];
  activeConnection: Connection | null;
  onActivate: (conn: Connection) => void;
  onClose: (conn: Connection) => void;
}) {
  return (
    <div className="tabs my-0">
      <ul className="mx-0 my-0">
        {props.connections.map((connection, ind) => (
          <li
            key={connection.connectionId}
            className={props.activeConnection === connection ? "is-active" : ""}
          >
            <a onClick={() => props.onActivate(connection)}>
              <span className="icon is-small">
                <i className="fas fa-server"></i>
              </span>
              <span>
                {connection.name} ({ind + 1})
              </span>
              <button
                className="delete ml-2"
                onClick={() => props.onClose(connection)}
              ></button>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
