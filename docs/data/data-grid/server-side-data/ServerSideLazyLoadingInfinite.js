import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useMockServer } from '@mui/x-data-grid-generator';

function ServerSideLazyLoadingInfinite() {
  const { columns, fetchRows } = useMockServer(
    { rowLength: 100 },
    { useCursorPagination: false, minDelay: 300, maxDelay: 800 },
  );

  const dataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          firstRowToRender: `${params.start}`,
          lastRowToRender: `${params.end}`,
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );

        return {
          rows: getRowsResponse.rows,
        };
      },
    }),
    [fetchRows],
  );

  return (
    <div style={{ width: '100%', height: 400 }}>
      <DataGridPro
        columns={columns}
        unstable_dataSource={dataSource}
        lazyLoading
        paginationModel={{ page: 0, pageSize: 15 }}
      />
    </div>
  );
}

export default ServerSideLazyLoadingInfinite;
