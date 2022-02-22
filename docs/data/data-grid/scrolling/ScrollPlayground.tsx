import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import {
  DataGridPro,
  useGridApiRef,
  gridVisibleRowCountSelector,
  gridVisibleColumnsLengthSelector,
  gridVisibleColumnDefinitionsSelector,
  gridVisibleSortedRowIdsSelector,
  GridCellParams,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function ScrollPlayground() {
  const apiRef = useGridApiRef();

  const [coordinates, setCoordinates] = React.useState({
    rowIndex: 0,
    colIndex: 0,
  });

  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
  });

  React.useEffect(() => {
    const { rowIndex, colIndex } = coordinates;
    apiRef.current.scrollToIndexes(coordinates);
    const id = gridVisibleSortedRowIdsSelector(apiRef)[rowIndex];
    const column = gridVisibleColumnDefinitionsSelector(apiRef)[colIndex];
    apiRef.current.setCellFocus(id, column.field);
  }, [apiRef, coordinates]);

  const handleClick = (position: string) => () => {
    const maxRowIndex = gridVisibleRowCountSelector(apiRef) - 1;
    const maxColIndex = gridVisibleColumnsLengthSelector(apiRef) - 1;

    setCoordinates((coords) => {
      switch (position) {
        case 'top':
          return { ...coords, rowIndex: Math.max(0, coords.rowIndex - 1) };
        case 'bottom':
          return { ...coords, rowIndex: Math.min(maxRowIndex, coords.rowIndex + 1) };
        case 'left':
          return { ...coords, colIndex: Math.max(0, coords.colIndex - 1) };
        case 'right':
          return { ...coords, colIndex: Math.min(maxColIndex, coords.colIndex + 1) };
        default:
          return { ...coords, rowIndex: 0, colIndex: 0 };
      }
    });
  };

  const handleCellClick = (params: GridCellParams) => {
    const rowIndex = gridVisibleSortedRowIdsSelector(apiRef).findIndex(
      (id) => id === params.id,
    );
    const colIndex = gridVisibleColumnDefinitionsSelector(apiRef).findIndex(
      (column) => column.field === params.field,
    );
    setCoordinates({ rowIndex, colIndex });
  };

  return (
    <div style={{ width: '100%' }}>
      <Box sx={{ width: 300, margin: '0 auto 16px' }}>
        <Grid container justifyContent="center">
          <Grid item>
            <Button onClick={handleClick('top')}>top</Button>
          </Grid>
        </Grid>
        <Grid container textAlign="center">
          <Grid item xs={4}>
            <Button onClick={handleClick('left')}>left</Button>
          </Grid>
          <Grid item xs={4}>
            <IconButton
              color="primary"
              aria-label="home"
              onClick={handleClick('home')}
            >
              <HomeIcon />
            </IconButton>
          </Grid>
          <Grid item xs={4}>
            <Button onClick={handleClick('right')}>right</Button>
          </Grid>
        </Grid>
        <Grid container justifyContent="center">
          <Grid item>
            <Button onClick={handleClick('bottom')}>bottom</Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ height: 400, bgcolor: 'background.paper' }}>
        <DataGridPro
          apiRef={apiRef}
          onCellClick={handleCellClick}
          hideFooter
          {...data}
        />
      </Box>
    </div>
  );
}
