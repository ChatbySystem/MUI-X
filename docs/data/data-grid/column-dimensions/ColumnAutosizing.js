import * as React from 'react';
import { Button } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function ColumnAutosizing() {
  const apiRef = useGridApiRef();
  const { data } = useDemoData({ dataSet: 'Commodity', rowLength: 1000 });

  return (
    <div style={{ width: '100%' }}>
      <div style={{ paddingBottom: '1em' }}>
        <Button
          variant="outlined"
          onClick={() => apiRef.current.autosizeColumns({ includeHeader: false })}
        >
          Autosize columns
        </Button>
      </div>
      <div style={{ height: 400, width: '100%' }}>
        <DataGridPro apiRef={apiRef} density="compact" {...data} />
      </div>
    </div>
  );
}
