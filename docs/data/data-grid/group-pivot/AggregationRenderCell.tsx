import * as React from 'react';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { useMovieData } from '@mui/x-data-grid-generator';
import Rating from '@mui/material/Rating';

const COLUMNS: GridColDef[] = [
  { field: 'title', headerName: 'Title', width: 200, groupable: false },
  {
    field: 'imdbRating',
    headerName: 'Rating',
    type: 'number',
    width: 180,
    availableAggregationFunctions: ['min', 'max', 'avg', 'size'],
    // Imdb rating is on a scale from 0 to 10, the MUI rating component is on a scale from 0 to 5
    renderCell: (params) => {
      if (params.aggregation && !params.aggregation.hasCellUnit) {
        return params.formattedValue;
      }

      return (
        <Rating
          name={params.row.title}
          value={params.value / 2}
          readOnly
          precision={0.5}
        />
      );
    },
  },
];

export default function AggregationRenderCell() {
  const data = useMovieData();

  // We take movies with the highest and lowest rating to have a visual difference
  const rows = React.useMemo(() => {
    const sortedRows = [...data.rows].sort((a, b) => b.imdbRating - a.imdbRating);

    return [...sortedRows.slice(0, 2), ...sortedRows.slice(-1)];
  }, [data.rows]);

  return (
    <div style={{ height: 319, width: '100%' }}>
      <DataGridPro
        rows={rows}
        columns={COLUMNS}
        initialState={{
          aggregation: {
            model: {
              imdbRating: 'avg',
            },
          },
        }}
        experimentalFeatures={{
          aggregation: true,
        }}
      />
    </div>
  );
}
