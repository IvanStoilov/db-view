import { QueryResult } from "../../model/QueryResult";

export function StatusBar(props: { result: QueryResult | null }) {
  return <div>{getText()}</div>;
  function getText() {
    if (!props.result) {
      return "";
    } else if (props.result.ddlStatus) {
      return props.result.ddlStatus.affectedRows + " row(s) affected";
    } else {
      return props.result.data.length + " row(s)";
    }
  }
}
