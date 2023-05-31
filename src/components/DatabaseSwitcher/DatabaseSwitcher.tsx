import { useEffect, useState } from "react";
import { useAppContext } from "../../hooks/AppContext";

const SYSTEM_DB: Record<string, true> = {
  information_schema: true,
  mysql: true,
  performance_schema: true,
  sys: true,
};

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
          {getDatabases().map(getItem)}
          <hr className="dropdown-divider" />
          {getSystemDatabases().map(getItem)}
        </div>
      </div>
    </div>
  );

  function getItem(db: string) {
    return (
      <a
        key={db}
        onClick={() => switchDatabase(db)}
        className={
          "dropdown-item" + (db === props.currentDatabase ? " is-active" : "")
        }
      >
        {db}
      </a>
    );
  }

  function onOutsideClick() {
    setIsOpen(false);
  }

  function getDatabases() {
    return props.databases.filter(db => !SYSTEM_DB[db]);
  }
  function getSystemDatabases() {
    return props.databases.filter(db => !!SYSTEM_DB[db]);
  }

  async function switchDatabase(db: string) {
    await connections.switchDatabase(db);
    setIsOpen(false);
  }
}
