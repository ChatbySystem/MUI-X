import * as React from 'react';
import {
  DataGridPro,
  GridGroupingColDefOverride,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import {
  useMovieData,
  useKeepGroupingColumnsHidden,
} from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

const INITIAL_GROUPING_COLUMN_MODEL = ['company', 'director'];

export default function RowGroupingCustomGroupingColDefCallback() {
  const data = useMovieData();
  const apiRef = useGridApiRef();
  const [rowGroupingModel, setRowGroupingModel] = React.useState(
    INITIAL_GROUPING_COLUMN_MODEL,
  );

  const columns = useKeepGroupingColumnsHidden(
    apiRef,
    data.columns,
    INITIAL_GROUPING_COLUMN_MODEL,
  );

  const rowGroupingModelStr = rowGroupingModel.join('-');

  return (
    <div style={{ width: '100%' }}>
      <Stack
        sx={{ width: '100%', mb: 1 }}
        direction="row"
        alignItems="flex-start"
        columnGap={1}
      >
        <Chip
          label="Group by company"
          onClick={() => setRowGroupingModel(['company'])}
          variant="outlined"
          color={rowGroupingModelStr === 'company' ? 'primary' : undefined}
        />
        <Chip
          label="Group by company and director"
          onClick={() => setRowGroupingModel(['company', 'director'])}
          variant="outlined"
          color={rowGroupingModelStr === 'company-director' ? 'primary' : undefined}
        />
      </Stack>
      <Box sx={{ height: 400 }}>
        <DataGridPro
          {...data}
          apiRef={apiRef}
          columns={columns}
          disableSelectionOnClick
          rowGroupingModel={rowGroupingModel}
          groupingColDef={(params) => {
            const override: GridGroupingColDefOverride = {};
            if (params.fields.includes('director')) {
              return {
                headerName: 'Director',
                valueFormatter: (valueFormatterParams) => {
                  const rowNode = apiRef.current.getRowNode(
                    valueFormatterParams.id!,
                  );
                  if (rowNode?.groupingField === 'director') {
                    return `by ${rowNode.groupingKey ?? ''}`;
                  }
                  return undefined;
                },
              };
            }

            return override;
          }}
          experimentalFeatures={{
            rowGrouping: true,
          }}
        />
      </Box>
    </div>
  );
}
