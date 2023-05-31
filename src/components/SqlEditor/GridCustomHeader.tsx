import { IHeaderParams } from 'ag-grid-community';

export function GridCustomHeader(props: IHeaderParams & { type: string }) {
  return <div><span>{props.column.getId()}</span><span className='ml-2 has-text-grey-light is-size-7'>{props.type}</span></div>
}
