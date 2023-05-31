import { useEffect, useState } from "react";
import { useAppContext } from "../../hooks/AppContext";

export function DatabaseSwitcher(props: {
  databases: string[];
  currentDatabase: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { connections } = useAppContext();

  useEffect(() => {
    window.addEventListener("click", onOutsideClick);
    return () => {
      window.removeEventListener("click", onOutsideClick);
    };
  }, [props.databases, props.currentDatabase]);

  return (
    <div
      className={"dropdown" + (isOpen ? " is-active" : "")}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="dropdown-trigger">
        <button
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{props.currentDatabase}</span>
          <span className="icon is-small">
            <i className="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {props.databases.map((db) => (
            <a
              onClick={() => switchDatabase(db)}
              className={
                "dropdown-item" +
                (db === props.currentDatabase ? " is-active" : "")
              }
            >
              {db}
            </a>
          ))}
          <hr className="dropdown-divider" />
          <a href="#" className="dropdown-item">
            With a divider
          </a>
        </div>
      </div>
    </div>
  );

  function onOutsideClick() {
    setIsOpen(false);
  }

  async function switchDatabase(db: string) {
    await connections.switchDatabase(db);
    setIsOpen(false);
  }
}
