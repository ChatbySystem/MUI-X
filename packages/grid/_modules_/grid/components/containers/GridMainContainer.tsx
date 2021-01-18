import * as React from 'react';

export function GridMainContainer(props: React.PropsWithChildren<{}>) {
  return <div className="MuiDataGrid-mainContainer">{props.children}</div>;
}
