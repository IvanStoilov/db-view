import { IHeaderParams } from "ag-grid-community";
import { useState } from "react";
import "./GridCustomHeader.css";

const NEXT_SORT: Record<string, "asc" | "desc" | null> = {
  null: "asc",
  asc: "desc",
  desc: null,
};

export function GridCustomHeader(props: IHeaderParams & { type: string }) {
  const [sort, setSort] = useState<"asc" | "desc" | null>(null);

  return (
    <div className="grid-custom-header" onClick={rotateSort}>
      <span>{props.column.getId()}</span>
      <span className="ml-2 has-text-grey-light is-size-7">{props.type}</span>
      <span className="grid-custom-header__sort-button">
        {getIcon()}
      </span>
    </div>
  );

  function rotateSort() {
    const newSort = NEXT_SORT[sort ? sort : "null"];
    props.setSort(newSort);
    setSort(newSort);
  }

  function getIcon() {
    switch (sort) {
      case null:
        return null;
      case "asc":
        return <i className="fas fa-arrow-up-short-wide"></i>;
      case "desc":
        return <i className="fas fa-arrow-down-wide-short"></i>;
    }
  }
}
