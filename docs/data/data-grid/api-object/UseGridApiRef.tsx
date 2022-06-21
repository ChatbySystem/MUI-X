import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function UseGridApiRef() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const apiRef = useGridApiRef();

  const handleGoToPage1 = () => apiRef.current.setPage(1);

  return (
    <Stack spacing={2} sx={{ width: '100%' }} alignItems="flex-start">
      <Button onClick={handleGoToPage1}>Go to page 1</Button>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGridPro {...data} apiRef={apiRef} pagination pageSize={10} />
      </Box>
    </Stack>
  );
}
