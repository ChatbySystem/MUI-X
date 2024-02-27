import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

const confirmPaste = () => {
  const confirmed = window.confirm('Are you sure you want to paste?');
  if (!confirmed) {
    return Promise.reject();
  }
  return undefined;
};

export default function ClipboardPasteEvents() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 6,
    editable: true,
  });
  const [loading, setLoading] = React.useState(false);

  const processRowUpdate = React.useCallback(async (newRow) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    return newRow;
  }, []);

  const initialState = {
    ...data.initialState,
    columns: {
      columnVisibilityModel: {
        id: false,
        desk: false,
      },
    },
  };

  return (
    <div style={{ width: '100%', height: 400 }}>
      <DataGridPremium
        {...data}
        loading={loading}
        initialState={initialState}
        cellSelection
        processRowUpdate={processRowUpdate}
        onClipboardPasteBeforeStart={confirmPaste}
        onClipboardPasteStart={() => setLoading(true)}
        onClipboardPasteEnd={() => setLoading(false)}
        ignoreValueFormatterDuringExport
        disableRowSelectionOnClick
      />
    </div>
  );
}
