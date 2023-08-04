/*
 * NOTE: This test requires that a CSP preventing `eval()` be present to be useful.
 * See ../template.html for the CSP meta tag.
 */

import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const baselineProps = {
  rows: [
    {
      id: 0,
      brand: 'Nike',
      year: 1990,
    },
    {
      id: 1,
      brand: 'Adidas',
      year: 1995,
    },
    {
      id: 2,
      brand: 'Puma',
      year: 1993,
    },
    {
      id: 3,
      brand: 'Gucci',
      year: 1996,
    },
  ],
  columns: [
    { field: 'brand', width: 120 },
    { field: 'year', width: 120 },
  ],
};

export default function FilterEval() {
  return (
    <div style={{ width: 400, height: 200 }}>
      <DataGrid
        {...baselineProps}
        filterModel={{
          items: [{ field: 'brand', operator: 'contains', value: 'Nike' }],
        }}
      />
    </div>
  );
}
