import { GridState } from '../../hooks/features/core/gridState';
import { GridApiRef } from '../api/gridApiRef';
import { GridColumns } from '../colDef/gridColDef';
import { GridOptions } from '../gridOptions';
import { GridRootContainerRef } from '../gridRootContainerRef';
import { GridRowModel } from '../gridRows';

/**
 * Object passed as React prop in the component override.
 */
export interface GridBaseComponentProps {
  /**
   * The GridState object containing the current grid state.
   */
  state: GridState;
  /**
   * The full set of rows.
   */
  rows: GridRowModel[];
  /**
   * The full set of columns.
   */
  columns: GridColumns;
  /**
   * The full set of options.
   */
  options: GridOptions;
  /**
   * GridApiRef that let you manipulate the grid.
   */
  api: GridApiRef;
  /**
   * The ref of the inner div Element of the grid.
   */
  rootElement: GridRootContainerRef;
}
