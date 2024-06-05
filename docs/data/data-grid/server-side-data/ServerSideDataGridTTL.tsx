import * as React from 'react';
import {
  DataGridPro,
  GridDataSource,
  SimpleServerSideCache,
} from '@mui/x-data-grid-pro';
import { useMockServer } from '@mui/x-data-grid-generator';
import LoadingSlate from './LoadingSlateNoSnap';

const lowTTLCache = new SimpleServerSideCache({ ttl: 1000 * 60 * 1 }); // 1 minute

function ServerSideDataGridTTL() {
  const { isInitialized, columns, initialState, fetchRows } = useMockServer(
    {},
    { useCursorPagination: false },
  );

  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: encodeURIComponent(
            JSON.stringify(params.paginationModel),
          ),
          filterModel: encodeURIComponent(JSON.stringify(params.filterModel)),
          sortModel: encodeURIComponent(JSON.stringify(params.sortModel)),
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
        };
      },
    }),
    [fetchRows],
  );

  const initialStateWithPagination = React.useMemo(
    () => ({
      ...initialState,
      pagination: {
        paginationModel: { pageSize: 10, page: 0 },
        rowCount: 0,
      },
    }),
    [initialState],
  );

  return (
    <div style={{ width: '100%', height: 400 }}>
      {isInitialized ? (
        <DataGridPro
          columns={columns}
          unstable_dataSource={dataSource}
          unstable_dataSourceCache={lowTTLCache}
          pagination
          initialState={initialStateWithPagination}
          pageSizeOptions={[10, 20, 50]}
        />
      ) : (
        <LoadingSlate />
      )}
    </div>
  );
}

export default ServerSideDataGridTTL;
