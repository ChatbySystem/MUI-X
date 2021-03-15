import * as React from 'react';
import { XGrid, GridOverlay } from '@material-ui/x-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import LinearProgress from '@material-ui/core/LinearProgress';

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: 'absolute', top: 0, width: '100%' }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

export default function InfiniteLoadingGrid() {
  const [loading, setLoading] = React.useState(false);
  const { data, setRowLength } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 6,
  });

  const loadServerRows = (newRowLength) => {
    setLoading(true);
    setTimeout(() => {
      setRowLength(newRowLength);
      setLoading(false);
    }, Math.random() * 500 + 100);
  };

  const handleOnRowsScrollEnd = (params) => {
    const newRowLength = params.virtualRowsCount + params.viewportPageSize;
    loadServerRows(newRowLength);
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <XGrid
        {...data}
        loading={loading}
        hideFooterPagination
        onRowsScrollEnd={handleOnRowsScrollEnd}
        components={{
          LoadingOverlay: CustomLoadingOverlay,
        }}
      />
    </div>
  );
}
