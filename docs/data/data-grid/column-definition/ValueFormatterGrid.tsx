import * as React from 'react';
import { DataGrid, GridValueFormatterParams } from '@mui/x-data-grid';

const rows = [
  {
    id: 1,
    taxRate: 0.1,
  },
  {
    id: 2,
    taxRate: 0.2,
  },
  {
    id: 3,
    taxRate: 0.3,
  },
];

export default function ValueFormatterGrid() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={[
          {
            type: 'number',
            field: 'taxRate',
            headerName: 'Tax Rate',
            width: 150,
            valueGetter: (params) => {
              if (!params.value) {
                return params.value;
              }
              return params.value * 100;
            },
            valueFormatter: (params: GridValueFormatterParams<number>) => {
              if (params.value == null) {
                return '';
              }
              return `${params.value.toLocaleString()} %`;
            },
          },
        ]}
      />
    </div>
  );
}
