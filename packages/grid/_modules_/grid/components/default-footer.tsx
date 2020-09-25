import * as React from 'react';
import { GridOptions } from '../models';
import { GridFooter } from './styled-wrappers/GridFooter';
import { RowCount } from './row-count';
import { SelectedRowCount } from './selected-row-count';
import { ApiContext } from './api-context';

export interface DefaultFooterProps {
  options: GridOptions;
  paginationComponent: React.ReactNode;
  rowCount: number;
}

export const DefaultFooter = React.forwardRef<HTMLDivElement, DefaultFooterProps>(
  function DefaultFooter(props, ref) {
    const { options, rowCount, paginationComponent } = props;
    const apiRef = React.useContext(ApiContext);
    const [selectedRowCount, setSelectedCount] = React.useState(0);

    React.useEffect(() => {
      if (apiRef && apiRef.current) {
        return apiRef.current!.onSelectionChange(({ rows }) => setSelectedCount(rows.length));
      }

      return undefined;
    }, [apiRef]);

    if (options.hideFooter) {
      return null;
    }

    return (
      <GridFooter ref={ref}>
        {!options.hideFooterRowCount && <RowCount rowCount={rowCount} />}
        {!options.hideFooterSelectedRowCount && (
          <SelectedRowCount selectedRowCount={selectedRowCount} />
        )}
        {paginationComponent}
      </GridFooter>
    );
  },
);
