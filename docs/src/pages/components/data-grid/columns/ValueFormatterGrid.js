import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

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
            valueFormatter: (params) => {
              const valueFormatted = Number(params.value * 100).toLocaleString();
              return `${valueFormatted} %`;
            },
          },
        ]}
      />
    </div>
  );
}
