import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  GridColDef,
  GridRowModel,
  unstable_useGridPivoting,
  Unstable_GridPivotModel as PivotModel,
  Unstable_GridPivotModelEditor as GridPivotModelEditor,
} from '@mui/x-data-grid-premium';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const initialRows: GridRowModel[] = [
  { id: 1, product: 'Product 1', type: 'Type A', price: 10, quantity: 2 },
  { id: 2, product: 'Product 2', type: 'Type A', price: 12, quantity: 3 },
  { id: 3, product: 'Product 3', type: 'Type B', price: 8, quantity: 1 },
  { id: 4, product: 'Product 4', type: 'Type C', price: 20, quantity: 8 },
];

const initialColumns: GridColDef[] = [
  { field: 'product' },
  { field: 'type' },
  { field: 'price' },
  { field: 'quantity' },
];

export default function GridPivotingBasic() {
  const apiRef = useGridApiRef();

  const [pivotModel, setPivotModel] = React.useState<PivotModel>({
    rows: ['type'],
    columns: [],
    values: [{ field: 'price', aggFunc: 'sum' }],
  });

  const { isPivot, setIsPivot, props } = unstable_useGridPivoting({
    rows: initialRows,
    columns: initialColumns,
    pivotModel,
  });

  return (
    <div style={{ width: '100%' }}>
      <FormControlLabel
        control={
          <Switch checked={isPivot} onChange={(e) => setIsPivot(e.target.checked)} />
        }
        label="Pivot"
      />
      {isPivot && (
        <GridPivotModelEditor
          columns={initialColumns}
          pivotModel={pivotModel}
          onPivotModelChange={setPivotModel}
        />
      )}
      <div style={{ height: 400, width: '100%' }}>
        <DataGridPremium
          key={isPivot.toString()}
          {...props}
          apiRef={apiRef}
          experimentalFeatures={{ columnGrouping: true }}
        />
      </div>
    </div>
  );
}
