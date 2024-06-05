import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import {
  DataGridPro,
  GridColDef,
  GridRowsProp,
  GridRowParams,
  useGridApiContext,
  useGridSelector,
  gridDetailPanelExpandedRowIdsSelector,
  GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
} from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomCurrency,
  randomEmail,
  randomPrice,
} from '@mui/x-data-grid-generator';

export default function DetailPanelCollapseAll() {
  const getDetailPanelContent = React.useCallback(
    ({ row }: GridRowParams) => <Box sx={{ p: 2 }}>{`Order #${row.id}`}</Box>,
    [],
  );

  const getDetailPanelHeight = React.useCallback(() => 50, []);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        rows={rows}
        columns={columns}
        getDetailPanelContent={getDetailPanelContent}
        getDetailPanelHeight={getDetailPanelHeight}
      />
    </div>
  );
}

function CustomDetailPanelHeader() {
  const apiRef = useGridApiContext();
  const expandedRowIds = useGridSelector(
    apiRef,
    gridDetailPanelExpandedRowIdsSelector,
  );
  const areDetailPanelsOpen = expandedRowIds.length > 0;

  const closeAllDetailPanels = () => apiRef.current.setExpandedDetailPanels([]);

  return (
    <IconButton
      size="small"
      tabIndex={-1}
      disabled={!areDetailPanelsOpen}
      onClick={closeAllDetailPanels}
      aria-label={'Close All'}
    >
      <UnfoldLessIcon
        sx={{
          opacity: `${areDetailPanelsOpen ? 1 : 0}`,
          transition: (theme) =>
            theme.transitions.create('opacity', {
              duration: theme.transitions.duration.shortest,
            }),
        }}
        fontSize="inherit"
      />
    </IconButton>
  );
}

const columns: GridColDef[] = [
  {
    ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
    renderHeader: () => <CustomDetailPanelHeader />,
  },
  { field: 'id', headerName: 'Order ID' },
  { field: 'customer', headerName: 'Customer', width: 200 },
  { field: 'date', type: 'date', headerName: 'Placed at' },
  { field: 'currency', headerName: 'Currency' },
  { field: 'total', type: 'number', headerName: 'Total' },
];

const rows: GridRowsProp = [
  {
    id: 1,
    customer: 'Matheus',
    email: randomEmail(),
    date: randomCreatedDate(),
    currency: randomCurrency(),
    total: randomPrice(1, 1000),
  },
  {
    id: 2,
    customer: 'Olivier',
    email: randomEmail(),
    date: randomCreatedDate(),
    currency: randomCurrency(),
    total: randomPrice(1, 1000),
  },
  {
    id: 3,
    customer: 'Flavien',
    email: randomEmail(),
    date: randomCreatedDate(),
    currency: randomCurrency(),
    total: randomPrice(1, 1000),
  },
  {
    id: 4,
    customer: 'Danail',
    email: randomEmail(),
    date: randomCreatedDate(),
    currency: randomCurrency(),
    total: randomPrice(1, 1000),
  },
  {
    id: 5,
    customer: 'Alexandre',
    email: randomEmail(),
    date: randomCreatedDate(),
    currency: randomCurrency(),
    total: randomPrice(1, 1000),
  },
];
