import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function ClipboardPaste() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 20,
    editable: true,
  });

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPremium
        {...data}
        checkboxSelection
        disableRowSelectionOnClick
        unstable_cellSelection
        experimentalFeatures={{ clipboardPaste: true }}
        unstable_ignoreValueFormatterDuringExport
      />
    </div>
  );
}
