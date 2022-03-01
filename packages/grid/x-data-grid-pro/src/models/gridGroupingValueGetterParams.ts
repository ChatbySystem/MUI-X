import { GridRowId, GridRowModel, GridRowTreeNodeConfig } from '@mui/x-data-grid';
import { GridColDef, GridStateColDef } from './gridColDef';

/**
 * Parameters passed to `colDef.groupingValueGetter`.
 */
export interface GridGroupingValueGetterParams<V = any, R = any> {
  /**
   * The grid row id.
   */
  id: GridRowId;
  /**
   * The column field of the cell that triggered the event.
   */
  field: string;
  /**
   * The cell value, does not take `valueGetter` into account.
   */
  value: V;
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: GridRowModel<R>;
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: GridColDef<R, V, any> | GridStateColDef<R, V, any>;
  /**
   * The node of the row that the current cell belongs to.
   * It only contains the information available before the actual grouping.
   */
  rowNode: Pick<GridRowTreeNodeConfig, 'id' | 'isAutoGenerated'>;
}
