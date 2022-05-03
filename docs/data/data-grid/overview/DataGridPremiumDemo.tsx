import * as React from 'react';
import {
  DataGridPremium,
  GridToolbar,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function DataGridPremiumDemo() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 25,
  });
  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      ...data.initialState,
      rowGrouping: {
        ...data.initialState?.rowGrouping,
        model: ['commodity'],
      },
      sorting: {
        sortModel: [{ field: '__row_group_by_columns_group__', sort: 'asc' }],
      },
    },
  });

  return (
    <div style={{ height: 520, width: '100%' }}>
      <DataGridPremium
        {...data}
        apiRef={apiRef}
        loading={loading}
        disableSelectionOnClick
        initialState={initialState}
        groupingColDef={{
          leafField: 'traderEmail',
        }}
        components={{ Toolbar: GridToolbar }}
      />
    </div>
  );
}
