import * as React from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';
import Button, { ButtonProps } from '@mui/material/Button';
import { createSvgIcon } from '@mui/material/utils';
import {
  DataGrid,
  GridCsvExportOptions,
  GridCsvGetRowsToExportParams,
  gridPaginatedVisibleSortedGridRowIdsSelector,
  gridSortedRowIdsSelector,
  GridToolbarContainer,
  gridExpandedSortedRowIdsSelector,
  useGridApiContext,
} from '@mui/x-data-grid';

const getRowsFromCurrentPage = ({ apiRef }: GridCsvGetRowsToExportParams) =>
  gridPaginatedVisibleSortedGridRowIdsSelector(apiRef);

const getUnfilteredRows = ({ apiRef }: GridCsvGetRowsToExportParams) =>
  gridSortedRowIdsSelector(apiRef);

const getFilteredRows = ({ apiRef }: GridCsvGetRowsToExportParams) =>
  gridExpandedSortedRowIdsSelector(apiRef);

const ExportIcon = createSvgIcon(
  <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z" />,
  'SaveAlt',
);

function CustomToolbar() {
  const apiRef = useGridApiContext();

  const handleExport = (options: GridCsvExportOptions) =>
    apiRef.current.exportDataAsCsv(options);

  const buttonBaseProps: ButtonProps = {
    color: 'primary',
    size: 'small',
    startIcon: <ExportIcon />,
  };

  return (
    <GridToolbarContainer>
      <Button
        {...buttonBaseProps}
        onClick={() => handleExport({ getRowsToExport: getRowsFromCurrentPage })}
      >
        Current page rows
      </Button>
      <Button
        {...buttonBaseProps}
        onClick={() => handleExport({ getRowsToExport: getFilteredRows })}
      >
        Filtered rows
      </Button>
      <Button
        {...buttonBaseProps}
        onClick={() => handleExport({ getRowsToExport: getUnfilteredRows })}
      >
        Unfiltered rows
      </Button>
    </GridToolbarContainer>
  );
}

export default function CsvGetRowsToExport() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        components={{ Toolbar: CustomToolbar }}
        pageSize={10}
        rowsPerPageOptions={[10]}
        initialState={{
          ...data.initialState,
          filter: {
            ...data.initialState?.filter,
            filterModel: {
              items: [{ field: 'quantity', operator: '>', value: '20000' }],
            },
          },
        }}
      />
    </div>
  );
}
